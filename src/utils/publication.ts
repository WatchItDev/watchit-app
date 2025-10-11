import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { MediaAttachment, Post } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export function getAttachmentCid(publication: Post, altTag: string): string {
  if (!publication) return '';
  const media = (publication as any)?.media as MediaAttachment[] | undefined;
  if (!media) return (publication as any)?.posterSquareCid ?? '';

  const lowerAlt = altTag.toLowerCase();
  const foundExact = media.find((el) => el?.title?.toLowerCase() === lowerAlt);
  if (foundExact?.cid) return foundExact.cid;

  const foundSimilar = media.find(
    (el) => el?.title?.toLowerCase()?.includes(lowerAlt),
  );
  if (foundSimilar?.cid) return foundSimilar.cid;

  return (publication as any)?.posterSquareCid ?? '';
}

export const getMediaUri = (cid: string): string =>
  `${GLOBAL_CONSTANTS.WATCHIT_GET_MEDIA_CONTENT_URL}/${cid}/`;

export const getIpfsUri = (cid: string): string =>
  cid.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');

export const getMovieCid = (publication: Post): string => {
  return publication?.cid ?? '';
};

// ----------------------------------------------------------------------
