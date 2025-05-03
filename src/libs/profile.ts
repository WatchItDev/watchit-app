import { ProfileData } from '@src/contexts/auth/types.ts';
import {Profile} from "@lens-protocol/api-bindings";
import { SocialLinkInput, UserInput } from '@src/graphql/generated/graphql.ts';

const removeEmptyValues = (obj: Partial<UserInput>): Partial<UserInput> =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v !== null));

/**
 * Build profile metadata object.
 * @param data - Profile data.
 * @param profileImageURI - URI of the profile image.
 * @param backgroundImageURI - URI of the background image.
 * @returns Metadata object.
 */
export const buildProfileMetadata = (
  data: ProfileData,
  profileImageURI?: string | null,
  backgroundImageURI?: string | null
): Partial<UserInput> => {
  const cleanSocialLinks = Object.entries(data.socialLinks ?? {})
    .filter(([, value]) => value !== '' && value !== null)
    .map(
      ([key, value]) =>
        ({
          platform: key,
          url: value,
        }) as SocialLinkInput
    );
  const metadata: Partial<UserInput> = {
    displayName: data.displayName ?? '',
    username: data.username ?? '',
    bio: data.bio ?? '',
    profilePicture: profileImageURI ?? '',
    coverPicture: backgroundImageURI ?? '',
    ...(cleanSocialLinks.length > 0 && { socialLinks: cleanSocialLinks }),
  };

  return removeEmptyValues(metadata);
};

/**
 * Filters out profiles that contain a specific hidden indicator in their "displayName", "bio", or "id" properties.
 *
 * @param {Profile[]} [profiles] - An optional array of Profile objects to be filtered.
 * @returns {Profile[] | null | undefined} An array of profiles excluding those with hidden indicators,
 *                                         or `null`/`undefined` if the input is `null`/`undefined`.
 */
export const filterHiddenProfiles = (profiles?: Profile[]): Profile[] | null | undefined => {
  // displayName, bio and lens id properties are checked for the hidden indicator
  const patterns = ['###HIDDEN###'];

  // Filter profiles that do not contain the hidden indicator in any of the checked properties
  return profiles?.filter((profile: Profile) => {
    return !patterns.some(pattern =>
      (profile?.metadata?.displayName?.includes(pattern) ||
        profile?.metadata?.bio?.includes(pattern) ||
        profile?.id?.includes(pattern))
    );
  });
};
