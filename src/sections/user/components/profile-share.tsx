import { FC } from 'react';
import ShareButton from '@src/components/share-button';
import { shareLinks, socialMedia, urlToShare } from '../CONSTANTS';
import { getSocialLinks } from '@src/utils/profile.ts';
import { ProfileShareProps } from '../types';

const ProfileShare: FC<ProfileShareProps> = ({ profile }) => (
  <ShareButton
    placeholder="profileId"
    pathPrefix="profile/"
    targetId={profile?.address}
    shareLinks={shareLinks}
    socialMediaList={socialMedia}
    socialMediaUrls={getSocialLinks(profile)}
    templateUrl={urlToShare}
  />
);

export default ProfileShare;
