import type { Social, User } from '@src/graphql/generated/graphql';

export type AppUser = User & {
  username?: string | null;
  bio?: string | null;
  profilePicture?: string | null;
  coverPicture?: string | null;
  socialLinks?: Social[] | null;
  followersCount?: number;
  followingCount?: number;
  publicationsCount?: number;
};

export const mapUserToAppUser = (user?: User | null): AppUser | undefined => {
  if (!user) return undefined;

  const profile = user.profile;
  const username = profile?.username ?? undefined;
  const bio = (user as any).bio ?? profile?.bio ?? undefined;
  const profilePicture = (user as any).profilePicture ?? profile?.picture ?? null;
  const coverPicture = (user as any).coverPicture ?? profile?.cover ?? null;
  const socialLinks = user.socials ?? [];
  const followersCount = (user as any).followersCount ?? (user as any)._count?.followers ?? undefined;
  const followingCount = (user as any).followingCount ?? (user as any)._count?.following ?? undefined;
  const publicationsCount = (user as any).publicationsCount ?? (user as any)._count?.posts ?? undefined;

  return {
    ...user,
    username,
    bio,
    profilePicture,
    coverPicture,
    socialLinks,
    followersCount,
    followingCount,
    publicationsCount,
  };
};
