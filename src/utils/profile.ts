import {profile as profileBuilder, MetadataAttributeType} from "@lens-protocol/metadata";
import {ProfileData} from "@src/auth/context/lens/types";

const removeEmptyValues = (obj: any): any =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== "" && v !== null));

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
): any => {
  const cleanSocialLinks = Object.entries(data.socialLinks ?? {})
    .filter(([_, value]) => value !== "" && value !== null)
    .map(
      ([key, value]) =>
        ({
          key,
          value,
          type: MetadataAttributeType.STRING,
        }) as any,
    );
  const metadata = {
    name: data.name ?? "",
    bio: data.bio ?? "",
    picture: profileImageURI ?? "",
    coverPicture: backgroundImageURI ?? "",
    ...(cleanSocialLinks.length > 0 && {attributes: cleanSocialLinks}),
  };
  const cleanedMetadata = removeEmptyValues(metadata);

  return profileBuilder(cleanedMetadata);
};
