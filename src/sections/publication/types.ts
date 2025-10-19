import { MutableRefObject, ReactNode } from 'react';
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
  onPlay?: () => void;
  onControlsVisibilityChange?: (visible: boolean) => void;
  playerContainerRef?: MutableRefObject<HTMLElement | null>;
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

export interface CommentReplyContext {
  comment: Comment;
  replyingToName?: string | null;
}

export interface PublicationCommentItemProps {
  comment: Comment;
  depth: 0 | 1;
  replyingToName?: string | null;
  replies?: CommentReplyContext[];
  onReplyCreated: () => void;
  showReplies?: boolean;
}

export interface PostCommentListProps {
  publicationId: string | number;
  showReplies?: boolean;
  onReplyCreated: () => void;
  initialData?: Comment[];
  loading?: boolean;
  onRequestRefresh?: () => void;
}

export interface MovieCommentFormProps {
  root?: string | number; // ID of the root publication (post or comment)
  commentOn: number | null; // ID of the publication (post or comment) to comment on
  owner: {
    id: string;
    displayName: string;
    avatar?: string;
  };
  onSuccess?: () => void;
}

export interface PublicationNewWizardStepsProps extends StepperProps {
  activeStep: number;
  goToStep: (step: number) => void;
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
