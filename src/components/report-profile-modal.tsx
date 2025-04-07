// LENS IMPORTS
import { useReportProfile, ProfileReportReason } from '@lens-protocol/react-web';
import { ReportModalBase } from '@src/components/report-modal-base.tsx';
import {Profile} from "@lens-protocol/api-bindings"
// @ts-expect-error No error in this context
import {UseDeferredTask} from "@lens-protocol/react/dist/declarations/src/helpers/tasks"

// ----------------------------------------------------------------------

interface ProfileReportModalProps {
  profile: Profile;
  isOpen: boolean;
  onClose: () => void;
}

// ----------------------------------------------------------------------

export const ReportProfileModal = ({ profile, isOpen, onClose }: ProfileReportModalProps) => {
  const { execute: report } = useReportProfile();

  const handleSubmit = async (reason: string, comments: string) => {
    return report({
      profileId: profile.id,
      reason: reason,
      additionalComments: comments,
    } as UseDeferredTask);
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
