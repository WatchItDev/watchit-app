import { Profile } from '@lens-protocol/api-bindings';
import { ProfileId } from '@lens-protocol/react-web';

export interface ProfileHeaderProps {
  profile: Profile;
}

export interface UserProfileViewProps {
  id: ProfileId;
}

// For the counts object
export interface CountsData {
  publications: number;
  followers: number;
  following: number;
  referrals: number;
}

// For tab items
export interface TabItem {
  value: string;
  label: string;
}

export interface TabItemWithCount extends TabItem {
  key: string;
  count: number;
}

// For the TabLabel component
export interface TabLabelProps {
  label: string;
  count: number;
}
