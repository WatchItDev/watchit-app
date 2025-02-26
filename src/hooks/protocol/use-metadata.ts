import { useState, useCallback } from 'react';
import { Metadata, UseMetadataReturn } from '@src/hooks/protocol/types.ts';

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
