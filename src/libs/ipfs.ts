import axios from 'axios';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { PinataHeaders, PinataResponse, IPFSMetadata } from './types';

/**
 * Pinata API keys from global constants.
 */
const pinataApiKey = GLOBAL_CONSTANTS.PINATA_API_KEY;
const pinataSecretApiKey = GLOBAL_CONSTANTS.PINATA_SECRET_API_KEY;

class IPFSError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'IPFSError';
  }
}

/**
 * Uploads data to IPFS using Pinata.
 *
 * @param data - File or JSON object to upload.
 * @returns {Promise<string>} - IPFS URI of the uploaded content.
 * @throws {Error} - Throws an error if the upload fails.
 */
export const uploadToIPFS = async (data: File | object): Promise<string> => {
  try {
    let url = '';
    let headers: PinataHeaders = {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    };
    let body: FormData | object;

    if (data instanceof File) {
      // Uploading a file
      url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const formData = new FormData();
      formData.append('file', data);

      body = formData;
      // Do not set 'Content-Type'; the browser will set it automatically
    } else {
      // Uploading JSON
      url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      body = data; // Send as an object; adjust if necessary

      headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await axios.post<PinataResponse>(url, body, {
      maxContentLength: Infinity,
      headers,
    });

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    const ipfsError = new IPFSError('Error uploading to IPFS', error instanceof Error ? error : undefined);
    console.error(ipfsError.message);
    throw ipfsError;
  }
};

/**
 * Uploads an image to IPFS.
 *
 * @param image - Image file.
 * @returns {Promise<string | null>} - IPFS URI of the uploaded image or null if no image.
 */
export const uploadImageToIPFS = async (image: File | null): Promise<string | null> => {
  try {
    return image ? await uploadToIPFS(image) : null;
  } catch (error) {
    const ipfsError = new IPFSError('Error uploading image to IPFS', error instanceof Error ? error : undefined);
    console.error(ipfsError.message);
    throw ipfsError;
  }
};

/**
 * Uploads profile and background images to IPFS.
 *
 * @param profileImage - Profile image file.
 * @param backgroundImage - Background image file.
 * @returns {Promise<{ profileImageURI: string | null; backgroundImageURI: string | null }>} - URIs of the uploaded images.
 */
export const uploadImagesToIPFS = async (
  profileImage: File | null,
  backgroundImage: File | null
): Promise<{ profileImageURI: string | null; backgroundImageURI: string | null }> => {
  try {
    const profileImageURI = profileImage ? await uploadToIPFS(profileImage) : null;
    const backgroundImageURI = backgroundImage ? await uploadToIPFS(backgroundImage) : null;
    return { profileImageURI, backgroundImageURI };
  } catch (error) {
    const ipfsError = new IPFSError('Error uploading images to IPFS', error instanceof Error ? error : undefined);
    console.error(ipfsError.message);
    throw ipfsError;
  }
};

/**
 * Uploads metadata to IPFS.
 *
 * @param metadata - Metadata object.
 * @returns {Promise<string>} - IPFS URI of the uploaded metadata.
 */
export const uploadMetadataToIPFS = async (metadata: IPFSMetadata): Promise<string> => {
  try {
    return await uploadToIPFS(metadata);
  } catch (error) {
    const ipfsError = new IPFSError('Error uploading metadata to IPFS', error instanceof Error ? error : undefined);
    console.error(ipfsError.message);
    throw ipfsError;
  }
};

/**
 * Verifies the availability of data on IPFS.
 *
 * @param uri - IPFS URI to verify.
 * @param retries - Number of retry attempts.
 * @param delayMs - Delay in milliseconds between retries.
 * @returns {Promise<boolean>} - Resolves to true if data is accessible, otherwise throws an error.
 */
export const verifyIpfsData = async (
  uri: string,
  retries = 16,
  delayMs = 2000
): Promise<boolean> => {
  const gateway = 'https://gw.ipfs-lens.dev/ipfs/'; // Use only lens's gateway

  const hash = uri.replace('ipfs://', '');
  const url = `${gateway}${hash}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, { timeout: 4000 });
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      const ipfsError = new IPFSError('Error verifying IPFS data', error instanceof Error ? error : undefined);
      console.error(ipfsError.message);
    }
    if (attempt < retries) {
      console.log(`Retrying in ${delayMs}ms... (${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new IPFSError('Could not verify the availability of metadata on IPFS.');
};
