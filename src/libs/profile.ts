import { ProfileData } from '@src/contexts/auth/types.ts';
import type {
  CreateUserInput,
  SocialInput,
  User,
} from '@src/graphql/generated/graphql.ts';
import type { AppUser } from '@src/types/app-user.ts';

type ProfileMetadata = Partial<Omit<CreateUserInput, 'address'>>;

const removeEmptyValues = (obj: ProfileMetadata): ProfileMetadata =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== '' && v !== null && v !== undefined,
    ),
  ) as ProfileMetadata;

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
  backgroundImageURI?: string | null,
): ProfileMetadata => {
  const cleanSocials = Object.entries(data.socialLinks ?? {})
    .filter(([, value]) => value !== '' && value !== null)
    .map(
      ([key, value]) =>
        ({
          platform: key,
          url: value,
        }) as SocialInput,
    );
  const metadata: ProfileMetadata = {
    displayName: data.displayName ?? '',
    username: data.username ?? '',
    bio: data.bio ?? '',
    picture: profileImageURI ?? undefined,
    cover: backgroundImageURI ?? undefined,
    ...(cleanSocials.length > 0 && { socials: cleanSocials }),
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
export const filterHiddenProfiles = (
  profiles?: Array<User | AppUser>,
): Array<User | AppUser> | null | undefined => {
  // displayName, bio and address properties are checked for the hidden indicator
  const patterns = ['###HIDDEN###'];

  // Filter profiles that do not contain the hidden indicator in any of the checked properties
  return profiles?.filter((profile) => {
    const bio =
      'bio' in profile && profile.bio !== undefined
        ? profile.bio
        : (profile as User).profile?.bio;
    const displayName = profile.displayName;
    return !patterns.some(
      (pattern) =>
        displayName?.includes(pattern) ||
        bio?.includes(pattern) ||
        profile.address?.includes(pattern),
    );
  });
};
