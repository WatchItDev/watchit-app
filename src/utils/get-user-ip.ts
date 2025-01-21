import axios from 'axios';
import {GLOBAL_CONSTANTS} from "@src/config-global";

/**
 * Asynchronously retrieves the user's public IP address using the IPify API.
 *
 * The function makes an HTTP GET request to the IPify API endpoint defined in the `GLOBAL_CONSTANTS.IPIFY_URL`.
 * If the request is successful, it returns the user's IPv4 or IPv6 address as a string.
 * In case of an error, it logs the error to the console and returns a default string indicating the failure.
 *
 * @function
 * @returns {Promise<string>} A promise that resolves to the user's public IP address as a string,
 * or a default string in case of an error.
 */
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await axios.get(GLOBAL_CONSTANTS.IPIFY_URL);
    return response.data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unable to fetch IP';
  }
};

/**
 * Asynchronously retrieves information for a given IP address.
 *
 * This function utilizes an external API to fetch detailed data associated with the IP address
 * passed as an argument. The API URL is constructed based on a global constant. If the request
 * is successful, the response data is returned. If an error occurs during the process, an error
 * message is logged to the console and a fallback message is returned.
 *
 * @param {string} ip - The IP address for which information is to be retrieved.
 * @returns {Promise<any>} A promise that resolves to the data retrieved from the API, or a string
 * indicating that the information could not be fetched in case of an error.
 */
export const getIPInfo = async (ip: string): Promise<any> => {
  try {
    const request = GLOBAL_CONSTANTS.IPINFO_URL.replace(':ip', ip);
    const response = await axios.get(request);
    return response.data;
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return 'Unable to fetch IP info';
  }
};


