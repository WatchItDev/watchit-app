import { useReportProfile, ProfileReportReason } from '@lens-protocol/react-web'
import { ReportModalBase } from '@src/components/report-modal-base.tsx'

type ProfileReportModalProps = {
  profile: any;
  isOpen: boolean;
  onClose: () => void;
};

export const ReportProfileModal = ({ profile, isOpen, onClose }: ProfileReportModalProps) => {
  const { execute: report } = useReportProfile()

  const handleSubmit = async (reason: string, comments: string) => {
    return report({
      profileId: profile.id,
      reason: reason,
      additionalComments: comments,
    } as any)
  }

  return (
    <ReportModalBase
      title="Report Profile"
      reasons={Object.values(ProfileReportReason)}
      onSubmit={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
    />
  )
}
