import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { StepperProps } from '@mui/material/Stepper';
import { Address } from 'viem';
import { Comment, Post } from '@src/graphql/generated/graphql.ts';

export interface PublicationDetailsViewProps {
  id: string;
}

export interface PublicationPlayerProps {
  publication: Post;
  loading: boolean;
}

export interface NeonPaperProps {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: string;
  padding?: string;
  borderRadius?: string;
  width?: string;
  height?: string;
  sx?: SxProps<Theme>;
}

export interface PublicationCommentItemProps {
  comment: Comment;
  hasReply?: boolean;
  canReply?: boolean;
}

export interface PostCommentListProps {
  publicationId: string;
  showReplies?: boolean;
}

export interface MovieCommentFormProps {
  root?: string; // ID of the root publication (post or comment)
  commentOn: string | null; // ID of the publication (post or comment) to comment on
  owner: {
    id: string;
    displayName: string;
    avatar?: string;
  };
}

export interface PublicationNewWizardStepsProps extends StepperProps {
  activeStep: number;
  goToStep: (step: number) => void;
}

export interface RepliesListProps {
  parentCommentId: string;
  canReply?: boolean;
}

export interface PublicationPosterWallpaperProps {
  publication: Post;
}

export interface PublicationTitleDescriptionProps {
  publication: Post;
}

export interface MorePublicationsSectionProps {
  author: string;
  publications: Post[];
}

export interface PublicationJoinButtonProps {
  joinButtonLoading: boolean;
  onJoin: () => void;
}

export interface PublicationSponsoredButtonProps {
  isActive: boolean;
  publication: Post;
  campaign: Address;
  onSponsorSuccess: () => void;
}
