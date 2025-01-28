import { useState } from "react";
// @MUI
import LoadingButton from '@mui/lab/LoadingButton';
import { Stack, Box, Typography, TextField, Button } from '@mui/material';

// Project Imports
import { useBoolean } from "@src/hooks/use-boolean.ts";
import ProcessSectionCard from '@src/components/process-section-card.tsx';
import StudioProcessModal from "@src/components/modal.tsx";
// @ts-ignore
import Process from '@src/assets/illustrations/process.svg';
import Iconify from '@src/components/iconify';

/**
 * `StudioProcess` is a React functional component that provides a user interface for publishing content.
 * It includes a primary call-to-action button and a modal for confirmation of publishing actions.
 *
 * The component uses the `useBoolean` hook to manage the modal's open/close state:
 * - Clicking the primary button triggers the display of the modal.
 * - Closing the modal resets the state.
 */
const StudioProcess = () => {
  const confirmPublish = useBoolean();

  const handleFinishPublish = () => {
    confirmPublish.onFalse?.();
  };

  const handleClick = () => {
    confirmPublish.onTrue?.();
  };

  return (
    <>
      <ProcessSectionCard
        title="Publish your content!"
        description="Bring your story to the screen. Captivate your audience, share your vision and expand your reach."
        buttonText="Publish now!"
        illustration={Process}
        illustrationAlt="Watchit Studio"
        onClick={handleClick}
      />
      <StudioProcessModal
        title="Publish your content"
        open={confirmPublish.value}
        onClose={handleFinishPublish}
        renderContent={<ProcessContent onClose={handleFinishPublish} />}
      />
    </>
  );
};

const ProcessContent = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [hashes, setHashes] = useState<string>('');

  const handleProcess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleHashesChange = (_event: React.ChangeEvent<HTMLInputElement>) => {
    setHashes(_event.target.value);
  }

  return (
    <Stack direction={'column'} sx={{ pb: 3, pt: 2, mt: 1, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}>
      <Box sx={{px: 3}}>
        <Typography variant="body1">
          Enter the hash of the content you want to publish
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          You can enter several hashes separated by commas.
        </Typography>

        <TextField
          sx={{ mt: 1, mb:2 }}
          fullWidth
          autoFocus
          label="Content Hash(es)"
          type="text"
          value={hashes}
          onChange={handleHashesChange}
          placeholder="Enter the hash (or hashes) of the content"
        />
      </Box>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 2, px: 3, pt: 3, borderTop: `1px dashed rgb(145, 158, 171, 0.5)` }}
      >
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          type="submit"
          onClick={handleProcess}
          startIcon={<Iconify icon="material-symbols:publish" />}
          disabled={!hashes || loading}
        >
          Publish
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default StudioProcess;
