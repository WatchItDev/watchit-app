import type { Post } from '@src/graphql/generated/graphql';

export type NormalizedMedia = {
  id: string;
  cid: string;
  title?: string;
  type?: string;
  url?: string;
};

export type NormalizedPost = Post & {
  author: {
    id?: number | null;
    address?: string;
    displayName?: string;
    username?: string;
    profilePicture?: string;
    coverPicture?: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
    publicationsCount?: number;
  };
  description?: string;
  likeCount?: number;
  bookmarkCount?: number;
  commentCount?: number;
  viewCount?: number;
  cid?: string;
  media?: NormalizedMedia[];
  posterSquareCid?: string;
};

const attachmentTitleMatches = (attachment: NormalizedMedia, ...candidates: string[]) => {
  const title = attachment.title?.toLowerCase() ?? '';
  return candidates.some((candidate) => title.includes(candidate));
};

export function normalizePost(post: Post): NormalizedPost {
  const attachments = ((post as any).attachments ?? []) as Array<any>;
  const base = post.base as any;
  const user = base?.user ?? {};
  const profile = user?.profile ?? {};

  const media: NormalizedMedia[] = attachments.map((attachment) => ({
    id: String(attachment.id ?? ''),
    cid: attachment.cid ?? '',
    title: attachment.title ?? '',
    type: attachment.type ?? '',
    url: attachment.url ?? '',
  }));

  const videoAttachment =
    media.find((item) => item.type?.toLowerCase() === 'video') ??
    media.find((item) => item.type?.toLowerCase().includes('mpegurl')) ??
    media.find((item) => attachmentTitleMatches(item, 'video', 'movie', 'hls')) ??
    (media.length ? media[0] : null);

  const posterAttachment =
    media.find((item) => attachmentTitleMatches(item, 'square')) ??
    media.find((item) => attachmentTitleMatches(item, 'poster')) ??
    null;

  return {
    ...post,
    author: {
      id: user?.id ?? null,
      address: user?.address ?? '',
      displayName: user?.displayName ?? profile?.username ?? '',
      followersCount: (post as any).author?.followersCount ?? 0,
      followingCount: (post as any).author?.followingCount ?? 0,
      coverPicture: profile?.cover ?? '',
      profilePicture: profile?.picture ?? '',
      bio: profile?.bio ?? '',
      publicationsCount: (post as any).author?.publicationsCount ?? 0,
      username: profile?.username ?? '',
    },
    description: (post as any).description ?? post.body ?? '',
    cid: (post as any).cid ?? videoAttachment?.cid ?? '',
    likeCount: (post as any).likeCount ?? 0,
    viewCount: (post as any).viewCount ?? 0,
    bookmarkCount: (post as any).bookmarkCount ?? 0,
    commentCount: (post as any).commentCount ?? 0,
    createdAt: (post as any).createdAt ?? base?.createdAt ?? '',
    updatedAt: (post as any).updatedAt ?? base?.createdAt ?? '',
    visibility: (post as any).visibility ?? base?.visibility ?? 'PUBLIC',
    media,
    posterSquareCid: posterAttachment?.cid ?? '',
  };
}
