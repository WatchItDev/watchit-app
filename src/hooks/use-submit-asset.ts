import { useState, useCallback } from 'react';
import { useCreatePostMutation } from '@src/graphql/generated/hooks';
import { ERRORS } from '@src/libs/notifications/errors';
import {
  ErrorResult,
  MetadataAttachment,
  SuccessResult,
} from '@src/hooks/types.ts';
import {
  CreatePostInput,
  VisibilitySetting,
} from '@src/graphql/generated/graphql.ts';

export interface UseSubmitAssetReturn {
  data: SuccessResult | null;
  error: ErrorResult | null;
  loading: boolean;
  submitAsset: (cid: string) => Promise<void>;
}

const sanitize = (txt?: string) =>
  typeof txt === 'string'
    ? txt
        .replace(/"/g, `'`)
        .replace(/\\/g, '')
        .replace(/[\x00-\x1F\x7F]/g, '')
    : txt;

export function useSubmitAsset(): UseSubmitAssetReturn {
  const [data, setData] = useState<SuccessResult | null>(null);
  const [error, setError] = useState<ErrorResult | null>(null);
  const [loading, setLoading] = useState(false);

  const [createPost] = useCreatePostMutation();

  const submitAsset = useCallback(
    async (cid: string) => {
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const res = await fetch(`https://g.watchit.movie/metadata/${cid}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const meta = await res.json();
        const { title, description, attachments } = meta.Data ?? {};

        const required = ['poster', 'square', 'wallpaper'];
        const byTitle = Object.fromEntries(
          attachments.map((a: MetadataAttachment) => [a.title, a]),
        ) as Record<string, { cid: string; type: string; title: string }>;

        if (required.some((key) => !byTitle[key])) {
          throw new Error('Missing poster / square / wallpaper attachments');
        }

        const urlFor = (c: string) => `https://g.watchit.movie/content/${c}/`;

        const media: CreatePostInput['media'] = required.map((k) => ({
          cid: byTitle[k].cid,
          url: urlFor(byTitle[k].cid),
          title: byTitle[k].title,
          type: byTitle[k].type,
        }));

        const input: CreatePostInput = {
          title: title ?? 'Untitled',
          description: sanitize(description) ?? '',
          cid,
          media,
          visibility: VisibilitySetting.Public,
        };

        const { data: gData } = await createPost({ variables: { input } });

        if (!gData?.createPost) {
          throw new Error(ERRORS.POST_CREATE_ERROR);
        }

        setData({ hash: cid, status: 'success' });
      } catch (err) {
        console.error('submitAsset error', err);
        setError({
          hash: cid,
          status: 'error',
          message: ERRORS.POST_CREATE_ERROR,
        });
      } finally {
        setLoading(false);
      }
    },
    [createPost],
  );

  return { data, error, loading, submitAsset };
}
