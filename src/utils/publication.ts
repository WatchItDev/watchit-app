import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { MediaAttachment, Post } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export function getAttachmentCid(publication: Post, altTag: string): string {
  const found = publication?.media?.find((el: MediaAttachment) => el?.title === altTag);
  return found?.cid ?? '';
}

export const getMediaUri = (cid: string): string => `${GLOBAL_CONSTANTS.WATCHIT_GET_MEDIA_CONTENT_URL}/${cid}/`;

export const getIpfsUri = (cid: string): string => cid.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');

export const getMovieCid = (publication:Post): string => {
  return publication?.cid ?? '';
};

// ----------------------------------------------------------------------
