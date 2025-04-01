// LENS IMPORTS
import { useReportPublication, PublicationReportReason } from '@lens-protocol/react-web';
import { ReportModalBase } from '@src/components/report-modal-base.tsx';
import {Post} from "@lens-protocol/api-bindings"
// @ts-expect-error No error in this context
import {UseDeferredTask} from "@lens-protocol/react/dist/declarations/src/helpers/tasks"

// ----------------------------------------------------------------------

interface PublicationReportModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ReportPublicationModal = ({ post, isOpen, onClose }: PublicationReportModalProps) => {
  const { execute: report } = useReportPublication();

  const handleSubmit = async (reason: string, comments: string) => {
    return report({
      publicationId: post.id,
      reason: reason,
      additionalComments: comments,
    } as UseDeferredTask);
  };

  return (
    <ReportModalBase
      title="Report Publication"
      reasons={Object.values(PublicationReportReason)}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
