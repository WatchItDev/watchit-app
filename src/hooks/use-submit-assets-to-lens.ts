import { useState, useCallback } from "react";
import { useCreatePost } from "@lens-protocol/react-web";
import { AnyMedia, MediaVideoMimeType, video } from "@lens-protocol/metadata";
import { uploadMetadataToIPFS, verifyIpfsData } from "@src/utils/ipfs.ts";
import uuidv4 from "@src/utils/uuidv4.ts";
import { ERRORS } from "@notifications/errors.ts";

interface SuccessResult {
  hash: string;
  status: "success";
}

interface ErrorResult {
  hash: string;
  status: "error";
  message: string;
}

interface UseSubmitAssetToLensReturn {
  data: SuccessResult[];
  errors: ErrorResult[];
  loading: boolean;
  submitAssetToLens: (hashesString: string) => Promise<void>;
}

export function useSubmitAssetToLens(): UseSubmitAssetToLensReturn {
  const [data, setData] = useState<SuccessResult[]>([]);
  const [errors, setErrors] = useState<ErrorResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { execute: createPost } = useCreatePost();

  /**
   * Sanitize the description to avoid strange characters
   */
  const sanitizeDescription = useCallback((description: any): string => {
    if (typeof description !== "string") {
      return description;
    }

    let sanitized = description.replace(/"/g, "'");
    sanitized = sanitized.replace(/\\/g, "");
    // eslint-disable-next-line no-control-regex
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, ""); // NOSONAR
    return sanitized;
  }, []);

  /**
   * Process a single hash
   */
  const processHash = useCallback(
    async (asset: string): Promise<SuccessResult | ErrorResult> => {
      try {
        // 1. Get metadata from the endpoint
        const response = await fetch(`https://g.watchit.movie/metadata/${asset}/`);

        if (!response.ok) {
          return {
            hash: asset,
            status: "error",
            message: `Error fetching metadata: ${response.statusText}`,
          };
        }

        const responseData = await response.json();
        const title = responseData.Data.title;
        const descriptionRaw = responseData.Data.description;
        const description = sanitizeDescription(descriptionRaw);

        // 2. Search for wallpaper and poster/large CIDs
        const cidMapping: Record<string, string> = {
          wallpaper: "wallpaperCid",
          poster: "posterCid",
          square: "squareCid",
        };

        const attachments = responseData.Data.attachments;
        const { posterCid, squareCid, wallpaperCid } = attachments.reduce((acc, attachment) => {
          const key = cidMapping[attachment.title];
          acc[key] = attachment.cid;
          return acc;
        }, {});

        const validAttachments = !posterCid || !squareCid || !wallpaperCid
        if (validAttachments) {
          return {
            hash: asset,
            status: "error",
            message: "Missing wallpaper or large CIDs",
          };
        }

        const getMediaUri = (cid: string) => `https://g.watchit.movie/content/${cid}/`;

        // 3. Assemble the attachments (media)
        const mediaConfig = [
          { cid: posterCid, type: "image/jpeg", altTag: "poster" },
          { cid: squareCid, type: "image/png", altTag: "square" },
          { cid: wallpaperCid, type: "image/png", altTag: "wallpaper" },
        ];

        const mediaItems: AnyMedia[] = mediaConfig.map(({ cid, type, altTag }) => ({
          item: getMediaUri(cid) as any,
          type: type as any,
          altTag: altTag as any,
        }));

        // 4. Create the metadata for Lens with @lens-protocol/metadata
        const metadata = video({
          id: uuidv4(),
          title: title,
          content: description,
          video: {
            item: asset,
            type: MediaVideoMimeType.MP4,
            altTag: "asset",
          },
          locale: "en",
          attachments: mediaItems,
          appId: "watchit",
        });

        // 5. Upload the metadata to IPFS via Pinata
        const metadataUri = await uploadMetadataToIPFS(metadata);

        // 6. Verify IPFS data
        await verifyIpfsData(metadataUri);

        // 7. Create the post in Lens
        const result = await createPost({
          metadata: metadataUri,
        });

        if (result.isFailure()) {
          return {
            hash: asset,
            status: "error",
            message: ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR,
          };
        } else {
          // 8. Wait for the transaction to be mined
          const completion = await result.value.waitForCompletion();
          if (completion.isFailure()) {
            return {
              hash: asset,
              status: "error",
              message: ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR,
            };
          } else {
            return {
              hash: asset,
              status: "success",
            };
          }
        }
      } catch (err: any) {
        return {
          hash: asset,
          status: "error",
          message: ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR,
        };
      }
    },
    [createPost, sanitizeDescription]
  );

  /**
   * Main function that processes one or more hashes (separated by commas)
   */
  const submitAssetToLens = useCallback(
    async (hashesString: string) => {
      setLoading(true);
      setErrors([]);
      setData([]);

      // Separate the string by commas and clean spaces
      const hashes = hashesString
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);

      // Map each hash to the processing function
      const promises = hashes.map((hash) => processHash(hash));

      // Wait for all promises to settle
      const results = await Promise.allSettled(promises);

      // Separate successful and failed results
      const successfulResults: SuccessResult[] = [];
      const errorResults: ErrorResult[] = [];

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const res = result.value;

          if (res.status === "success") {
            successfulResults.push(res as SuccessResult);
          } else {
            errorResults.push(res as ErrorResult);
          }
        } else {
          // This shouldn't happen as processHash handles its own errors
          errorResults.push({
            hash: hashes[index],
            status: "error",
            message: "Unexpected error",
          });
        }
      });

      // Update state after all hashes are processed
      setData(successfulResults);
      setErrors(errorResults);
      setLoading(false);
    },
    [processHash]
  );

  return {
    data,
    errors,
    loading,
    submitAssetToLens,
  };
}
