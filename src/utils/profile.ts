import { SocialMediaUrls, SocialPlatform } from '@src/sections/user/types.ts';
import { socialMedia } from '@src/sections/user/CONSTANTS.tsx';
import { User } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

export const getSocialLinks = (profile: User): SocialMediaUrls => {
  const VALID_PLATFORMS: SocialPlatform[] = socialMedia.map((item) => item.key);
  return (
    profile?.socialLinks?.reduce<SocialMediaUrls>((acc, link) => {
      const { platform, url } = link;
      if (VALID_PLATFORMS.includes(platform as keyof SocialMediaUrls)) {
        acc[platform as keyof SocialMediaUrls] = url;
      }
      return acc;
    }, {} as SocialMediaUrls) || {}
  );
};

// ----------------------------------------------------------------------
