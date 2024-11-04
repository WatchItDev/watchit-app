import axios from 'axios';

const pinataApiKey = '26e37a596e8e561427af';
const pinataSecretApiKey = '9d9469c678bb8db458851c5342f9201ab4811c29f281f7d8205a6a18cf302566';

export const uploadToIPFS = async (data: File | object): Promise<string> => {
  try {
    let url = '';
    let headers: any = {
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    };
    let body: any;

    if (data instanceof File) {
      // Subiendo un archivo
      url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
      const formData = new FormData();
      formData.append('file', data);

      body = formData;
      // No establezcas 'Content-Type'; el navegador lo hará automáticamente
    } else {
      // Subiendo JSON
      url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
      body = JSON.stringify(data); // Serializar los datos a una cadena JSON

      headers = {
        ...headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await axios.post(url, body, {
      maxContentLength: Infinity,
      headers
    });

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Upload image to IPFS.
 * @param image - Image file.
 * @returns URIs of the uploaded image.
 */
export const uploadImageToIPFS = async (
  image: File | null,
): Promise<string | null> => {
  try {
    return image ? await uploadToIPFS(image) : null;
  } catch (error) {
    console.error('Error uploading images to IPFS:', error);
    throw error;
  }
};

/**
 * Upload profile and background images to IPFS.
 * @param profileImage - Profile image file.
 * @param backgroundImage - Background image file.
 * @returns URIs of the uploaded images.
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
    console.error('Error uploading images to IPFS:', error);
    throw error;
  }
};

/**
 * Upload metadata to IPFS.
 * @param metadata - Metadata object.
 * @returns URI of the uploaded metadata.
 */
export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
  try {
    const metadataURI = await uploadToIPFS(metadata);
    return metadataURI;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
};
