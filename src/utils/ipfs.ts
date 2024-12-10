import Arweave from 'arweave';
import axios from 'axios';

import axios from 'axios';

/**
 * Configuración de Arweave.
 */
const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

const key = {"d":"hdR4BgctBScF3aoejYnG9Sa2NI_VnLYfW5hJ0rwWfzKK5XqW2l4pZeCXXdfM_Y11Z1MzDSfNSm3Oy6K7U-nKKnc05-gxL_Pgns4SNedGklJbzd3fKvgf2nNQohesiNvYal6SNQfge6rEl4kz2xZYzr2GBC_8kLly8lwRg1ZXMZy7xWLLJCXY5LSNvMRY0PtCLEN46FIsutejpe7w7WoU-RaIaqb-jAU6N6e1BLGPc5hsGl1iZUtvjAz8OcFEzIEioDLkX1axe0tg6VzgN73orwIrO6-VUK5zv2fWjwlUnllugrnFByM5Qh5Wqga7KPrM0Qwidp300d6IOlSY3XByNY_WFHj4bLEcATyQZZg9lg0y_WBQZH3CG8nFKfZd9VOmP-OdhDnVVecfNn3uZ86il1B9Osw7OPpXMQSt_2KNXa-D6lgTs-2WPC20eoJUQq0ZQMt69Oe-gG5ipzcBY4KfjVfdyvfumekyhQ9hs4W-hJtEKRAgyfMR6J4kv0rPurIaY8cdXcJs1ohDmAbipnWbzBv4siO9uFwGUMUWhQ8rq_X9DNMePSXF1bj6gnS7az7TPRzeQBlaJusoBqgyDnoN91sFDVS3Pt_kLBFALrgZwuZvUA8VWQ3cxyfjiZN-oNT40jfqfIV1dxJdOR-hqFho1cgsGK1ckIZ9CmirhIz3tAk","dp":"4O3UfjMNJ_kA6lbU5HnO-9JmpUFovMTMzQpD8MZKgFoNizjdTvRh4ln_WbomazZSHS1tJjyHHwzD374W-wNYhHhoiV9TYzev38sJcIhWYKZnW32p8PrJZJH-Ar4x4AcSoXm3DV0idxVv4DkHMMCk3GUXei9GXhNiQuvL7FRLUv_sBiKTise9qbHmu8vJnsr3Bz2slOkN8JlGmqqxSsVqBPfMmlUXmxWGuJy1cs5xCdjtD43aIFvAiBOJH60v34imILgZhnux3oul153IESh-MRZLaKFc7ITxd5v5GHgsFhjnqqvgLVOoXBOgYP95EUbEhnzYxIUGEU0G0k3HA7676w","dq":"hs9RFuVuG2O1nXpeYeoeD0oorO4tbMI5in8tRZkLP1Bfh9KOWL60oXQxu_fy5ZL9Yeq47q7pD2OmfnupaA3ftPcNTqUOgJGY1jLwMFEjQ6zKVBSMNBwqyfdcF4a1IAmwoQ1EzWQQpirMrHd2DgmJEf67D-WUsdDFr-Vssy_TyxHjPpVJC1qPfyxKTWLXm2ya0AiiV8vQRZkzhRCDkgzkqlTtWh0_7gw4c_Doyb9qO2H2O04hALyUUNo-gA-755BJR0v6kEF2xneNBeTlwxA8y6oUQ1LI97jKR55ub5GCLlZnkPTAWRB4NF0J-MAflSsVVQxh53vHbq5uYhdY1PhFVw","e":"AQAB","ext":true,"kty":"RSA","n":"loKIvWyivLmlQqjwj7ThljATGQXer4JyfXsyI0sVHBx54W5UCMXhCbwkTBVzUr_QJ4o96ITANs24_0uHhPJzxDm9Rk1gAZGPvkY9iZ917Mw3JHX3aTFPo7mVltT8caiMiMb42uxRKe7DSh5Trg2Zsx1ODeQLxsa9W1O0VOh0pM8YDosfAF1Uj0Ws8TRheoWvbfcLGI2VYGlJJqlNgOnuWpmR2GhHSTIiaQCJ9fXGDVYy6zW674Q-NAQT9Nkmf-YPRqxQqn-hVHbgZlSd7HgXCoeLPbwNiB8oRlbrp8CLoIEbPw8VqWNPkFhANdRkH_jtIrfNeXypyAwiTf0mV7VaGT9J59Wi_jDh3EyELEDXwqbjPnlwtpR7DXRWbCSs7phVhHJWP5F96UyOFcfBYGeV7573i84Z23s5rGyfGPQWS81J0PGPgyZqK71wrY5ONj5l6nETStLEaRIumGHhOkuCDH1X6QHwynfO2flWXHd7H9FiCCJwrD5Ox9M06RTtcNY019-4dfT0mO5pPvdqKlHcw09ZvW1yHnEo6DoSf-lty9OyAerqxtraKc5ZGJhJOW-iU8tpb0EVdAYIYUSgd78OoXGadjrGKgPIjiZEY5YwOJky5mdkL148a7DNwnR2O-ELd_Uc1SV86iRhJJHzMwv3pC5CMHYjK_cYvXbO7yVLK-E","p":"8vP3933-yghqtZFpWKcPqhG0qz_IGKna0dnFDcBYmPTw56TvXOji9DLKG2ORzNuj6wUrfouNM8PQEnAQpSqMdNeOBYbNbT5tfG6qmOt15rrz64QQE-9AWCUbKX8oGryiglDRGYXR1Z0OK71zyV58xCIxHevpFkWpEaHdYLWPJnjCAe0uVjZNkDtF7GzT3Yo_8nNtmsnMrRogSyQYV6-4ayzlC0j6sFM-d0Hs3ju3yQ6zBdBOB-GGNTRTzo-LMt1azqP53iRP2oXkzMgSupElbT_z2BtDOVndXNl-jGDOxGzC9YNrRRJj4l1BM7J-WfG4rOzuJ4H5lpNCUZw9BBzXTw","q":"npewzjGf7yvPyp7uw6lLrWoEp8wHWPyM4IewbmPSuopJL46nJYHUD3ZgQQpgJmg1JPExdzvVljETzUJjTaTDf1gUWxcBOahkbyHDdT8F0Rm9A3uQhVbSwoLIYLwiiFZbq6z2TWXtv54BG9NA15K85H8E5_SpV_Adx9m28lTVeXwUUDyLys2K9ymI2fOWifYX9n6OdzismzMSopwWTudQDSGrGhTFX9qt4MRxjZZDCj5rv1Yj9SmPaY-3HFJr2UDUcsc3E2pRMuKlvbLTJ3pw-tM6Qtt7gFBMZO9CcYy_n6X1h2lREKJZTx0q_1DUEfiAtLttuLdUVKLAl3zYT9D9zw","qi":"X4nJD6zmEDakKZxV3h-W25J-NcTnJiiaN2OmTqsGl2ueb3OtDNpzZ2oBX4NXGndw5dnuGJ5NvmTxt78E8bZ1DEVwHtXpss7YMKteZ-oJ0DMdiU8d_nuDONNK6kbEDq6AjbwwTNRvtmKIkW8zlJpWwFHcjxpi49Al7bmrn64NTIhSagHCBG-i5MeVLkHpX9cxjFEbGtpal-MZF1XhoqnyRCvIDpIR2LTd-doXaBTwKBgHodMYrYLqs6G_mx3zUovcnnoDZJMIRq54WH0mQvGyq_6Ue7Xp65ooemRP6BBgksIUJIULaSWPF6hNUhAWhd_CyxG4V1RJFlE5IWbm_mH_Qw"}

/**
 * Sube datos a Arweave.
 *
 * @param data - Archivo o objeto JSON para subir.
 * @returns {Promise<string>} - URI de Arweave del contenido subido.
 * @throws {Error} - Lanza un error si la subida falla.
 */
export const uploadToIPFS = async (data: File | object): Promise<string> => {
  try {
    let transaction;

    if (data instanceof File) {
      // Leer el archivo como ArrayBuffer
      const fileBuffer = await data.arrayBuffer();
      transaction = await arweave.createTransaction({ data: fileBuffer });
      transaction.addTag('Content-Type', data.type);
    } else {
      // Convertir el objeto JSON a string
      const jsonString = JSON.stringify(data);
      transaction = await arweave.createTransaction({ data: jsonString });
      transaction.addTag('Content-Type', 'application/json');
    }

    // Firmar la transacción (requiere una clave privada)
    // Reemplaza 'key' con tu clave privada de Arweave
    // const key = await arweave.wallets.generate(); // En producción, carga una clave existente
    console.log('key', key);
    await arweave.transactions.sign(transaction, key);

    // Enviar la transacción a la red de Arweave
    await arweave.transactions.post(transaction);

    return `https://arweave.net/${transaction.id}`;
  } catch (error) {
    console.error('Error uploading to Arweave:', error);
    throw error;
  }
};

/**
 * Sube una imagen a Arweave.
 *
 * @param image - Archivo de imagen.
 * @returns {Promise<string | null>} - URI de Arweave de la imagen subida o null si no hay imagen.
 */
export const uploadImageToIPFS = async (image: File | null): Promise<string | null> => {
  try {
    return image ? await uploadToIPFS(image) : null;
  } catch (error) {
    console.error('Error uploading image to Arweave:', error);
    throw error;
  }
};

/**
 * Sube imágenes de perfil y fondo a Arweave.
 *
 * @param profileImage - Archivo de imagen de perfil.
 * @param backgroundImage - Archivo de imagen de fondo.
 * @returns {Promise<{ profileImageURI: string | null; backgroundImageURI: string | null }>} - URIs de las imágenes subidas.
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
    console.error('Error uploading images to Arweave:', error);
    throw error;
  }
};

/**
 * Sube metadatos a Arweave.
 *
 * @param metadata - Objeto de metadatos.
 * @returns {Promise<string>} - URI de Arweave de los metadatos subidos.
 */
export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
  try {
    return await uploadToIPFS(metadata);
  } catch (error) {
    console.error('Error uploading metadata to Arweave:', error);
    throw error;
  }
};

/**
 * Verifica la disponibilidad de datos en el gateway de Lens.
 *
 * @param uri - URI de IPFS para verificar.
 * @param retries - Número de intentos de reintento (por defecto 5).
 * @param delayMs - Retraso en milisegundos entre intentos (por defecto 4000ms).
 * @returns {Promise<boolean>} - Devuelve true si los datos son accesibles, de lo contrario lanza un error.
 */
export const verifyIpfsData = async (uri: string, retries = 5, delayMs = 4000): Promise<boolean> => {
  const gateway = 'https://gw.ipfs-lens.dev/ipfs/';
  const hash = uri.replace('ipfs://', '');
  const url = `${gateway}${hash}`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Verifying ${url}`);

      // Utiliza una solicitud HEAD para verificar solo la existencia del recurso
      const response = await axios.head(url, { timeout: 4000 + attempt * 1000 });

      if (response.status === 200) {
        console.log('Data is available on Lens Gateway.');
        return true;
      }
    } catch (error: any) {
      console.warn(`Attempt ${attempt}: Could not access ${url}. Error: ${error.message}`);
    }

    if (attempt < retries) {
      console.log(`Retrying in ${delayMs}ms... (${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Could not verify the availability of metadata on Lens Gateway.');
};


// /**
//  * Verifica la disponibilidad de datos en Arweave.
//  *
//  * @param uri - URI de Arweave para verificar.
//  * @param retries - Número de intentos de reintento.
//  * @param delayMs - Retraso en milisegundos entre intentos.
//  * @returns {Promise<boolean>} - Devuelve true si los datos son accesibles, de lo contrario lanza un error.
//  */
// export const verifyIpfsData = async (uri: string, retries = 8, delayMs = 2000): Promise<boolean> => {
//   const url = uri;
//
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const response = await fetch(url, { method: 'HEAD' });
//       if (response.ok) {
//         return true;
//       }
//     } catch (error: any) {
//       console.warn(`Attempt ${attempt}: Could not access ${url}. Error: ${error.message}`);
//     }
//     if (attempt < retries) {
//       console.log(`Retrying in ${delayMs}ms... (${attempt}/${retries})`);
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }
//
//   throw new Error('Could not verify the availability of data on Arweave.');
// };







// import axios from 'axios';
// import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
//
// /**
//  * Pinata API keys from global constants.
//  */
// const pinataApiKey = GLOBAL_CONSTANTS.PINATA_API_KEY;
// const pinataSecretApiKey = GLOBAL_CONSTANTS.PINATA_SECRET_API_KEY;
//
// /**
//  * Uploads data to IPFS using Pinata.
//  *
//  * @param data - File or JSON object to upload.
//  * @returns {Promise<string>} - IPFS URI of the uploaded content.
//  * @throws {Error} - Throws an error if the upload fails.
//  */
// export const uploadToIPFS = async (data: File | object): Promise<string> => {
//   try {
//     let url = '';
//     let headers: any = {
//       pinata_api_key: pinataApiKey,
//       pinata_secret_api_key: pinataSecretApiKey,
//     };
//     let body: any;
//
//     if (data instanceof File) {
//       // Uploading a file
//       url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
//       const formData = new FormData();
//       formData.append('file', data);
//
//       body = formData;
//       // Do not set 'Content-Type'; the browser will set it automatically
//     } else {
//       // Uploading JSON
//       url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
//       body = data; // Send as an object; adjust if necessary
//
//       headers = {
//         ...headers,
//         'Content-Type': 'application/json',
//       };
//     }
//
//     const response = await axios.post(url, body, {
//       maxContentLength: Infinity,
//       headers,
//     });
//
//     return `ipfs://${response.data.IpfsHash}`;
//   } catch (error) {
//     console.error('Error uploading to IPFS:', error);
//     throw error;
//   }
// };
//
// /**
//  * Uploads an image to IPFS.
//  *
//  * @param image - Image file.
//  * @returns {Promise<string | null>} - IPFS URI of the uploaded image or null if no image.
//  */
// export const uploadImageToIPFS = async (image: File | null): Promise<string | null> => {
//   try {
//     return image ? await uploadToIPFS(image) : null;
//   } catch (error) {
//     console.error('Error uploading image to IPFS:', error);
//     throw error;
//   }
// };
//
// /**
//  * Uploads profile and background images to IPFS.
//  *
//  * @param profileImage - Profile image file.
//  * @param backgroundImage - Background image file.
//  * @returns {Promise<{ profileImageURI: string | null; backgroundImageURI: string | null }>} - URIs of the uploaded images.
//  */
// export const uploadImagesToIPFS = async (
//   profileImage: File | null,
//   backgroundImage: File | null
// ): Promise<{ profileImageURI: string | null; backgroundImageURI: string | null }> => {
//   try {
//     const profileImageURI = profileImage ? await uploadToIPFS(profileImage) : null;
//     const backgroundImageURI = backgroundImage ? await uploadToIPFS(backgroundImage) : null;
//     return { profileImageURI, backgroundImageURI };
//   } catch (error) {
//     console.error('Error uploading images to IPFS:', error);
//     throw error;
//   }
// };
//
// /**
//  * Uploads metadata to IPFS.
//  *
//  * @param metadata - Metadata object.
//  * @returns {Promise<string>} - IPFS URI of the uploaded metadata.
//  */
// export const uploadMetadataToIPFS = async (metadata: any): Promise<string> => {
//   try {
//     const metadataURI = await uploadToIPFS(metadata);
//     return metadataURI;
//   } catch (error) {
//     console.error('Error uploading metadata to IPFS:', error);
//     throw error;
//   }
// };
//
// /**
//  * Verifies the availability of data on IPFS.
//  *
//  * @param uri - IPFS URI to verify.
//  * @param retries - Number of retry attempts.
//  * @param delayMs - Delay in milliseconds between retries.
//  * @returns {Promise<boolean>} - Resolves to true if data is accessible, otherwise throws an error.
//  */
// export const verifyIpfsData = async (uri: string, retries = 8, delayMs = 2000): Promise<boolean> => {
//   const gateway = 'https://gw.ipfs-lens.dev/ipfs/'; // Use only lens's gateway
//
//   const hash = uri.replace('ipfs://', '');
//   const url = `${gateway}${hash}`;
//
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const response = await axios.get(url, { timeout: 4000 });
//       if (response.status === 200) {
//         return true;
//       }
//     } catch (error: any) {
//       console.warn(`Attempt ${attempt}: Could not access ${url}. Error: ${error.message}`);
//     }
//     if (attempt < retries) {
//       console.log(`Retrying in ${delayMs}ms... (${attempt}/${retries})`);
//       await new Promise((resolve) => setTimeout(resolve, delayMs));
//     }
//   }
//
//   throw new Error('Could not verify the availability of metadata on IPFS.');
// };
