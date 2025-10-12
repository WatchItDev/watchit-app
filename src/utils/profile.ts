import { SocialMediaUrls, SocialPlatform } from '@src/sections/user/types.ts';
import { socialMedia } from '@src/sections/user/CONSTANTS.tsx';
import { AppUser } from '@src/types/app-user.ts';

// ----------------------------------------------------------------------

export const getSocialLinks = (profile?: AppUser | null): SocialMediaUrls => {
  const VALID_PLATFORMS: SocialPlatform[] = socialMedia.map((item) => item.key);
  const socialEntries = profile?.socialLinks ?? profile?.socials ?? [];
  return (
    socialEntries?.reduce<SocialMediaUrls>((acc, link) => {
      const { platform, url } = link;
      if (VALID_PLATFORMS.includes(platform as keyof SocialMediaUrls)) {
        acc[platform as keyof SocialMediaUrls] = url;
      }
      return acc;
    }, {} as SocialMediaUrls) || {}
  );
};

// ----------------------------------------------------------------------
