// LENS IMPORTS
import { useReportPublication, PublicationReportReason } from '@lens-protocol/react-web';
import { ReportModalBase } from '@src/components/report-modal-base.tsx';

// ----------------------------------------------------------------------

type PublicationReportModalProps = {
  post: any;
  isOpen: boolean;
  onClose: () => void;
};

// ----------------------------------------------------------------------

export const ReportPublicationModal = ({ post, isOpen, onClose }: PublicationReportModalProps) => {
  const { execute: report } = useReportPublication();

  const handleSubmit = async (reason: string, comments: string) => {
    return report({
      publicationId: post.id,
      reason: reason,
      additionalComments: comments,
    } as any);
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
