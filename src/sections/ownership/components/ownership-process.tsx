import { useState } from 'react';

// MUI Imports
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';

// Project Imports
import Iconify from '@src/components/iconify';
import OwnershipProcessModal from '@src/components/modal.tsx';
import Ownership from '@src/assets/illustrations/ownership.svg';
import ProcessSectionCard from '@src/components/process-section-card.tsx';
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { replacePrefix } from '@src/utils/wallet.ts';
import { useBoolean } from '@src/hooks/use-boolean.ts';
import { useRegisterAsset } from '@src/hooks/protocol/use-register-asset.ts';
import { useGetAssetOwner } from '@src/hooks/protocol/use-get-asset-owner.ts';
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from '@src/libs/notifications/internal-notifications.ts';
import { useAuth } from '@src/hooks/use-auth.ts';
import { INFO } from '@src/libs/notifications/info.ts';
import { ERRORS } from '@src/libs/notifications/errors.ts';
import { SUCCESS } from '@src/libs/notifications/success.ts';
import { useSubmitAsset } from '@src/hooks/use-submit-asset.ts';

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

  const handleFinishOwnership = () => {
    confirmOwnership.onFalse?.();
  };

  const handleClickRegister = () => {
    confirmOwnership.onTrue?.();
  };

  return (
    <>
      <ProcessSectionCard
        title="Register your ownership!"
        description="Secure your copyrights and prove your authorship."
        buttonText="Register now"
        illustration={Ownership}
        illustrationAlt="Watchit Ownership"
        onClick={handleClickRegister}
      />
      <OwnershipProcessModal
        title="Intellectual Property Registration"
        open={confirmOwnership.value}
        onClose={handleFinishOwnership}
        renderContent={
          <OwnershipProcessContent onClose={handleFinishOwnership} />
        }
      />
    </>
  );
};

const OwnershipProcessContent = ({ onClose }: { onClose: () => void }) => {
  const [hashes, setHashes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { registerAsset } = useRegisterAsset();
  const { submitAsset } = useSubmitAsset();
  const { fetchOwnerAddress } = useGetAssetOwner();
  const { session } = useAuth();

  const hashesArray = hashes
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);
  const userAddress = session?.address as string | undefined;

  const handleRegister = async () => {
    if (!hashes) return;

    setProgress(1);
    setIsProcessing(true);

    try {
      for (const [index, hash] of hashesArray.entries()) {
        try {
          // 1. Report progress
          notifyInfo(
            INFO.REGISTER_OWNERSHIP_PROGRESS,
            {
              index: index + 1,
              total: hashesArray.length,
              options: { autoHideDuration: 3000 },
            },
            '',
            { autoHideDuration: 3000 },
          );
          setProgress(index + 1);

          const owner = await fetchOwnerAddress(hash);
          const isTaken = !!owner;
          const isAssetMine = userAddress === owner;

          if (!isAssetMine && isTaken) {
            notifyError(ERRORS.ASSET_ALREADY_REGISTERED_ERROR);
            continue;
          }

          if (!isTaken) {
            // 2. Register ownership (if it fails, it does not continue)
            await registerAsset(hash);
          }

          // 3. Upload to API only if registration was successful
          await submitAsset(replacePrefix(hash));
          notifySuccess(SUCCESS.OWNERSHIP_REGISTERED_SUCCESSFULLY, {
            count: index + 1,
          });
        } catch (error) {
          notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR, {
            hash: `${index + 1}/${hashesArray.length}`,
          });
          console.error('Error during ownership registration:', error);
          continue; // Continue with the next hash
        }
      }
    } catch (error) {
      notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR);
      console.error('Error during ownership registration:', error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const RainbowEffect = isProcessing ? NeonPaper : Box;

  return (
    <Stack
      direction="column"
      sx={{
        pb: 3,
        pt: 2,
        mt: 1,
        borderTop: '1px dashed rgba(145, 158, 171, 0.5)',
      }}
    >
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

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{
          mt: 2,
          px: 3,
          pt: 3,
          borderTop: '1px dashed rgba(145, 158, 171, 0.5)',
        }}
      >
        <Button variant="outlined" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <RainbowEffect
          {...(isProcessing && {
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
            {isProcessing
              ? `Processing... (${progress}/${hashesArray.length})`
              : 'Start Process'}
          </LoadingButton>
        </RainbowEffect>
      </Stack>
    </Stack>
  );
};

export default OwnershipProcess;
