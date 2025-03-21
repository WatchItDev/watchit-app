import { AnyPublication } from '@lens-protocol/api-bindings';
import { MediaVideo } from '@lens-protocol/metadata';
// @ts-expect-error No error in the library
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

// ----------------------------------------------------------------------

export function getAttachmentCid(publication: ReadResult<AnyPublication>, altTag: string): string {
  const found = publication?.metadata?.attachments?.find((el: MediaVideo) => el?.altTag === altTag);
  return found?.image?.raw?.uri ?? '';
}

export const getMediaUri = (cid: string): string => `${GLOBAL_CONSTANTS.WATCHIT_GET_MEDIA_CONTENT_URL}/${cid}/`;

export const getMovieCid = (publication:ReadResult<AnyPublication>): string => {
  return publication?.metadata?.asset?.video?.raw?.uri ?? '';
};

// ----------------------------------------------------------------------
