import { AnyPublication } from '@lens-protocol/api-bindings';
import { MediaVideo } from '@lens-protocol/metadata';
// @ts-ignore
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';

// ----------------------------------------------------------------------

export function getAttachmentCid(publication: ReadResult<AnyPublication>, altTag: string): string {
  const found = publication?.metadata?.attachments?.find((el: MediaVideo) => el?.altTag === altTag);
  return found?.image?.raw?.uri ?? '';
}

// ----------------------------------------------------------------------
