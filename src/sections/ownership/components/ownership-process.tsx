import { useState } from 'react';

// MUI Imports
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';

// Project Imports
import { useBoolean } from "@src/hooks/use-boolean.ts";
import ProcessSectionCard from '@src/components/process-section-card.tsx';
import OwnershipProcessModal from "@src/components/modal.tsx";
// @ts-ignore
import Ownership from '@src/assets/illustrations/ownership.svg';
import Iconify from '@src/components/iconify';
import { useRegisterAsset } from '@src/hooks/use-register-asset';
import { notifyError, notifyInfo, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';
import { INFO } from '@notifications/info.ts';
import { useSubmitAssetToLens } from '@src/hooks/use-submit-assets-to-lens.ts';
import NeonPaper from '@src/sections/publication/NeonPaperContainer.tsx';
import { useSelector } from 'react-redux';
import { useGetAssetOwner } from '@src/hooks/use-get-asset-owner.ts';
import { replacePrefix } from '@src/utils/wallet.ts';
import { useIsPolicyAuthorized } from '@src/hooks/use-is-policy-authorized.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { Address } from 'viem';
import { ActivateSubscriptionProfileModal } from '@src/components/activate-subscription-profile-modal.tsx';
import { SubscriptionWarningModal } from '@src/sections/ownership/components/pricing-warning-modal.tsx';

/**
 * OwnershipProcess is a React functional component that manages the process of registering ownership.
 *
 * The component consists of a section card prompting the user to register their ownership and a modal dialog
 * that handles the intellectual property registration process. It uses a boolean state to control the visibility
 * of the modal dialog.
 *
 * The main functionalities include:
 * - Displaying a card with a title, description, button, and illustration to prompt user interaction.
 * - Managing the modal visibility to handle the ownership registration process.
 */
const OwnershipProcess = () => {
  const confirmOwnership = useBoolean();
  const [isSetPricesModalOpen, setIsSetPricesModalOpen] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as Address | undefined;
  const {
    isAuthorized,
    loading: authorizedLoading,
    refetch,
  } = useIsPolicyAuthorized(GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS, userAddress);

  const handleClickRegister = () => {
    if (authorizedLoading) return;

    if (isAuthorized) {
      confirmOwnership.onTrue();
    } else {
      setShowWarningModal(true);
    }
  };

  const handleConfirmPriceSetup = () => {
    setShowWarningModal(false);
    setIsSetPricesModalOpen(true);
  };

  const handleSetPricesClose = () => {
    setIsSetPricesModalOpen(false);
    refetch();
  };

  return (
    <>
      <ProcessSectionCard
        title={isAuthorized ? "Register your ownership!" : "Set up prices first"}
        description={
          isAuthorized
            ? "Secure your copyrights and prove your authorship."
            : "Set subscription prices before registering your content."
        }
        buttonText={
          authorizedLoading ? "Checking..." : isAuthorized ? "Register now" : "Setting prices"
        }
        buttonIcon={!isAuthorized ? 'ion:logo-usd' : undefined}
        illustration={Ownership}
        illustrationAlt="Watchit Ownership"
        onClick={handleClickRegister}
      />

      <SubscriptionWarningModal
        open={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={handleConfirmPriceSetup}
      />

      <ActivateSubscriptionProfileModal
        isOpen={isSetPricesModalOpen}
        onClose={handleSetPricesClose}
      />

      <OwnershipProcessModal
        title="Intellectual Property Registration"
        open={confirmOwnership.value}
        onClose={confirmOwnership.onFalse}
        renderContent={<OwnershipProcessContent onClose={confirmOwnership.onFalse} />}
      />
    </>
  );
};

const OwnershipProcessContent = ({ onClose }: { onClose: () => void }) => {
  const [hashes, setHashes] = useState<string>('');
  const { registerAsset } = useRegisterAsset();
  const { submitAssetToLens } = useSubmitAssetToLens();
  const { fetchOwnerAddress } = useGetAssetOwner();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const sessionData = useSelector((state: any) => state.auth.session);
  const userAddress = sessionData?.profile?.ownedBy?.address as string | undefined;
  const hashesArray = hashes.split(',')
    .map(h => h.trim())
    .filter(Boolean);
  const { isAuthorized } = useIsPolicyAuthorized(
    GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS,
    userAddress as Address
  );

  const handleRegister = async () => {
    if (!hashes) return;

    if (!isAuthorized) {
      notifyError(ERRORS.SUBSCRIPTION_POLICY_NO_AUTORIZED);
      return;
    }

    setProgress(1);
    setIsProcessing(true);

    try {
      for (const [index, hash] of hashesArray.entries()) {
        try {
          // 1. Report progress
          notifyInfo(INFO.REGISTER_OWNERSHIP_PROGRESS, {
            index: index + 1,
            total: hashesArray.length,
            options: { autoHideDuration: 3000 }
          }, '', { autoHideDuration: 3000 });
          setProgress(index + 1);

          const owner = await fetchOwnerAddress(hash);
          const isAssetMine = userAddress === owner

          if (!isAssetMine) {
            notifyError(ERRORS.ASSET_ALREADY_REGISTERED_ERROR);
            continue;
          }

          if (!owner) {
            // 2. Register ownership (if it fails, it does not continue)
            await registerAsset(hash);
          }

          // 3. Upload to Lens only if registration was successful
          await submitAssetToLens(replacePrefix(hash));
          notifySuccess(SUCCESS.OWNERSHIP_REGISTERED_SUCCESSFULLY, { count: index + 1 });
        } catch (error) {
          notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR, { hash: `${index + 1}/${hashesArray.length}` });
          continue; // Continue with the next hash
        }
      }
    } catch (error) {
      notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const RainbowEffect = isProcessing ? NeonPaper : Box;

  return (
    <Stack direction="column" sx={{ pb: 3, pt: 2, mt: 1, borderTop: '1px dashed rgba(145, 158, 171, 0.5)' }}>
      <Box sx={{ px: 3 }}>
        <Typography variant="body1">
          Enter the hash(es) of the content you want to register
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          You can enter multiple hashes separated by commas.
        </Typography>

        <TextField
          sx={{ mt: 1, mb: 2 }}
          fullWidth
          autoFocus
          label="Content Hash(es)"
          type="text"
          value={hashes}
          onChange={(e) => setHashes(e.target.value)}
          placeholder="e.g., hash1,hash2,hash3"
          disabled={isProcessing}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2, px: 3, pt: 3, borderTop: '1px dashed rgba(145, 158, 171, 0.5)' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <RainbowEffect
          {...((isProcessing) && {
            borderRadius: '10px',
            animationSpeed: '3s',
            padding: '0',
            width: 'auto',
          })}
        >
          <LoadingButton
            variant="contained"
            onClick={handleRegister}
            loading={isProcessing}
            disabled={!hashes || isProcessing}
            loadingPosition="start"
            startIcon={<Iconify icon="material-symbols:publish" />}
          >
            {isProcessing ? `Processing... (${progress}/${hashesArray.length})` : 'Start Process'}
          </LoadingButton>
        </RainbowEffect>
      </Stack>
    </Stack>
  );
};

export default OwnershipProcess;
