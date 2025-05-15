import { ReportModalBase } from '@src/components/report-modal-base.tsx';
import { Post } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

interface PublicationReportModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ReportPublicationModal = ({ post, isOpen, onClose }: PublicationReportModalProps) => {

  const handleSubmit = async (reason: string, comments: string) => {

  };

  return (
    <ReportModalBase
      title="Report Publication"
      reasons={[]}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
