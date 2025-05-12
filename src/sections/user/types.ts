import { Invitation } from "@src/hooks/types.ts"
import { Post, User } from '@src/graphql/generated/graphql.ts';
import { socialMedia } from '@src/sections/user/CONSTANTS.tsx';

export interface ProfileHeaderProps {
  profile: User;
}

export interface UserProfileViewProps {
  id: string;
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

export interface SocialMediaUrls {
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface ProfileShareProps {
  profile: User;
}

export interface ProfileAttribute {
  key: string;
  value: string;
}

export interface ProfileReferralsTableRowProps {
  row: Invitation;
  selected: boolean;
}

export interface ProfileHomeProps {
  publications?: Post[]; // Array of publications
  minItemWidth?: number; // Min width per item
  maxItemWidth?: number; // Max width per item
  initialRows?: number; // Rows to show initially
  rowsIncrement?: number; // Rows to add each time "Show more" is clicked
  maxHeight?: string | number; // Max height for the parent container (e.g. '29rem', 400, etc.)
  scrollable?: boolean; // Whether the container is allowed to scroll or not
  scrollOnShowMore?: boolean; // Scroll down when user clicks "Show more"
}

export interface ProfileJoinProps extends ProfileHeaderProps {
  profileJoinProps: {
    hasAccess?: boolean;
    accessLoading: boolean;
    accessFetchingLoading?: boolean;
    onSubscribe: () => void;
  }
}

export interface ProfilePublicationItemProps {
  publication: Post;
}

export interface ProfileFollowersProps {
  onActionFinished?: () => void;
}

export type SocialPlatform = typeof socialMedia[number]['key'];
