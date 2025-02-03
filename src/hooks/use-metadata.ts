import { useState, useCallback } from 'react';

/**
 * Interface representing each attachment in the metadata.
 */
export interface Attachment {
  cid: string;
  type: string;
  title: string;
  description: string;
}

/**
 * Interface representing the Data object within the metadata response.
 */
export interface MetadataData {
  title: string;
  description: string;
  attachments: Attachment[];
  custom_fields: any;
}

/**
 * Interface representing the overall metadata response structure.
 */
export interface Metadata {
  Type: string;
  Data: MetadataData;
}

/**
 * Interface representing the return value of the useMetadata hook.
 */
export interface UseMetadataReturn {
  metadata: Metadata | null;
  loading: boolean;
  getMetadata: (cid: string) => Promise<Metadata>;
}

/**
 * Custom React hook to fetch metadata from a specific URL using a CID.
 *
 * @returns {UseMetadataReturn} An object containing:
 *  - metadata: The fetched metadata or null.
 *  - loading: A boolean indicating the loading state.
 *  - getMetadata: An asynchronous function to fetch the metadata.
 */
const useMetadata = (): UseMetadataReturn => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Asynchronous function to fetch metadata using the provided CID.
   *
   * @param {string} cid - The CID used to construct the request URL.
   * @returns {Promise<Metadata>} The fetched metadata.
   * @throws Will throw an error if the fetch operation fails.
   */
  const getMetadata = useCallback(async (cid: string): Promise<Metadata> => {
    setLoading(true);
    try {
      const response = await fetch(`https://g.watchit.movie/metadata/${cid}/`);

      if (!response.ok) {
        throw new Error(`Error fetching metadata: ${response.statusText}`);
      }

      const data: Metadata = await response.json();
      setMetadata(data);
      return data;
    } catch (error) {
      console.error(error);
      setMetadata(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { metadata, loading, getMetadata };
};

export default useMetadata;
