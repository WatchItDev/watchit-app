import { profile as profileBuilder, MetadataAttributeType } from '@lens-protocol/metadata';
import { ProfileData } from 'src/auth/context/lens/types';

/**
 * Build profile metadata object.
 * @param data - Profile data.
 * @param profileImageURI - URI of the profile image.
 * @param backgroundImageURI - URI of the background image.
 * @returns Metadata object.
 */
export const buildProfileMetadata = (
  data: ProfileData,
  profileImageURI: string | null,
  backgroundImageURI: string | null
): any =>
  profileBuilder({
    name: data.name ?? '',
    bio: data.bio ?? '',
    picture: profileImageURI ?? '',
    coverPicture: backgroundImageURI ?? '',
    attributes: [
      {
        key: 'nickname',
        value: data.nickname,
        type: MetadataAttributeType.STRING,
      },
      // Add social links as attributes
      ...Object.entries(data.socialLinks ?? {}).map(
        ([key, value]) =>
          ({
            key,
            value,
            type: MetadataAttributeType.STRING,
          } as any)
      ),
    ],
  });
