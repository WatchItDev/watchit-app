import { profile as profileBuilder, MetadataAttributeType } from '@lens-protocol/metadata';
import { ProfileData } from '@src/auth/context/lens/types';
import {Profile} from "@lens-protocol/api-bindings";

const removeEmptyValues = (obj: any): any =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== '' && v !== null));

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
): any => {
  const cleanSocialLinks = Object.entries(data.socialLinks ?? {})
    .filter(([_, value]) => value !== '' && value !== null)
    .map(
      ([key, value]) =>
        ({
          key,
          value,
          type: MetadataAttributeType.STRING,
        }) as any
    );
  const metadata = {
    name: data.name ?? '',
    bio: data.bio ?? '',
    picture: profileImageURI ?? '',
    coverPicture: backgroundImageURI ?? '',
    ...(cleanSocialLinks.length > 0 && { attributes: cleanSocialLinks }),
  };
  const cleanedMetadata = removeEmptyValues(metadata);

  return profileBuilder(cleanedMetadata);
};

/**
 * Filters an array of profiles to exclude any profiles with hidden indicators.
 *
 * This function removes profiles that have a "displayName" or "bio" property containing
 * the substring '###HIDDEN###'. Any profiles containing this substring in either property are excluded
 * from the returned array.
 *
 * @param {Profile[]} profiles - The array of profile objects to filter.
 * @return {any[]} An array of filtered profiles excluding those marked as hidden.
 */
export const filterHiddenProfiles = (profiles?: Profile[]): Profile[] | null | undefined => {
  // displayName, bio and lens id properties are checked for the hidden indicator
  const patterns = ['###HIDDEN###'];

  // Filter profiles that do not contain the hidden indicator in the "displayName" or "bio" properties using the patterns array
  return profiles?.filter((profile: Profile) => !patterns.some((pattern) => profile?.metadata?.displayName?.includes(pattern) || profile?.metadata?.bio?.includes(pattern) || profile?.id.includes(pattern)));

  // @ts-ignore
  //return profiles.filter((profile) => !profile?.metadata?.displayName?.includes('###HIDDEN###') && !profile?.metadata?.bio.includes('###HIDDEN###'));
};
