import {verifyIpfsData} from "@src/utils/ipfs";

export interface CommentPayload {
  uri: string;
  pendingCommentId: string;
}

self.onmessage = async (event: MessageEvent<{type: string; payload: CommentPayload}>) => {
  const {type, payload} = event.data;

  if (type === "VERIFY_IPFS") {
    const {uri, pendingCommentId} = payload;

    try {
      // Verify metadata on IPFS
      await verifyIpfsData(uri);

      // Send a success message to main thread

      self.postMessage({success: true, pendingCommentId});
    } catch (error) {
      // Send a error message to main thread

      self.postMessage({success: false, error: (error as Error).message, pendingCommentId});
    }
  }
};
