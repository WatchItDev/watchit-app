import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { StepperProps } from '@mui/material/Stepper';
import { ReadResult } from '@lens-protocol/react/dist/declarations/src/helpers/reads';
import { AnyPublication } from '@lens-protocol/api-bindings';
import { Address } from 'viem';
import { PublicationId } from '@lens-protocol/metadata';

export interface PublicationDetailsViewProps {
  id: PublicationId;
}

export interface PublicationPlayerProps {
  publication: any;
  loading: boolean;
}

export interface NeonPaperProps {
  children: ReactNode;
  colors?: string[];
  animationSpeed?: string;
  padding?: string;
  borderRadius?: string;
  width?: string;
  sx?: SxProps<Theme>;
}

export interface PublicationCommentItemProps {
  comment: any;
  hasReply?: boolean;
  canReply?: boolean;
}

export interface PostCommentListProps {
  publicationId: string;
  showReplies?: boolean;
}

export interface MovieCommentFormProps {
  root?: any; // ID of the root publication (post or comment)
  commentOn: string; // ID of the publication (post or comment) to comment on
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
  publication?: ReadResult<AnyPublication>;
  isSponsoredButtonVisible?: boolean;
  isJoinButtonVisible?: boolean;
  isActive?: boolean;
  joinButtonLoading: boolean;
  onJoin: () => void;
  onSponsorSuccess: () => void;
  campaign: Address;
}

export interface PublicationTitleDescriptionProps {
  publication: ReadResult<AnyPublication>;
}

export interface MorePublicationsSectionProps {
  author: string;
  publications: ReadResult<AnyPublication>[];
}
