import { useEffect, useState } from 'react';

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
import { notifyError, notifySuccess } from '@notifications/internal-notifications.ts';
import { SUCCESS } from '@notifications/success.ts';
import { ERRORS } from '@notifications/errors.ts';

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
        renderContent={<OwnershipProcessContent onClose={handleFinishOwnership} />}
      />
    </>
  );
};

const OwnershipProcessContent = ({ onClose }: { onClose: () => void }) => {
  const [hashes, setHashes] = useState<string>('');
  const { registerAsset, loading, error } = useRegisterAsset();

  useEffect(() => {
    if (!error) return;

    notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR);
  }, [error])

  const handleRegister = async () => {
    if (!hashes) return;
    try {
      await registerAsset(hashes);
      notifySuccess(SUCCESS.OWNERSHIP_REGISTERED_SUCCESSFULLY);
      onClose();
    } catch (e) {
      notifyError(ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR);
    }
  };

  const handleHashesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHashes(event.target.value);
  };

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
          onChange={handleHashesChange}
          placeholder="e.g., hash1,hash2,hash3"
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2, px: 3, pt: 3, borderTop: '1px dashed rgba(145, 158, 171, 0.5)' }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          onClick={handleRegister}
          startIcon={<Iconify icon="material-symbols:publish" />}
          disabled={!hashes || loading}
          loading={loading}
        >
          Register
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default OwnershipProcess;
