import { ReportModalBase } from '@src/components/report-modal-base.tsx';
import { User } from '@src/graphql/generated/graphql.ts';

// ----------------------------------------------------------------------

interface ProfileReportModalProps {
  profile: User;
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ReportProfileModal = ({ profile, isOpen, onClose }: ProfileReportModalProps) => {
  // TODO implement the report profile mutation

  const handleSubmit = async (reason: string, comments: string) => {

  };

  return (
    <ReportModalBase
      title="Report Profile"
      reasons={Object.values(ProfileReportReason)}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};
