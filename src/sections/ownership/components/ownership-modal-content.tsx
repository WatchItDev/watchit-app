import LoadingButton from "@mui/lab/LoadingButton";
import NeonPaper from '@src/sections/publication/components/neon-paper-container.tsx';
import { FC, useState } from 'react';
import {
  Button,
  DialogActions,
  Divider,

  Box, Typography, TextField, Stack,
} from '@mui/material'
import {notifyError, notifyInfo, notifySuccess} from '@notifications/internal-notifications.ts'
import { SUCCESS } from '@notifications/success.ts';
import { CampaignModalContentProps } from '@src/sections/marketing/types.ts';
import Iconify from "@src/components/iconify"
import {INFO} from "@notifications/info.ts"
import {ERRORS} from "@notifications/errors.ts"
import {replacePrefix} from "@src/utils/wallet.ts"
import {useRegisterAsset} from "@src/hooks/protocol/use-register-asset.ts"
import {useSubmitAssetToLens} from "@src/hooks/use-submit-assets-to-lens.ts"
import {useGetAssetOwner} from "@src/hooks/protocol/use-get-asset-owner.ts"
// ----------------------------------------------------------------------

const OwnershipModalContent: FC<CampaignModalContentProps> = ({ onClose }) => {
  const [hashes, setHashes] = useState<string>('');
  const { registerAsset } = useRegisterAsset();
  const { submitAssetToLens } = useSubmitAssetToLens();
  const { fetchOwnerAddress } = useGetAssetOwner();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const hashesArray = hashes.split(',')
    .map(h => h.trim())
    .filter(Boolean);

  const RainbowEffect = isProcessing ? NeonPaper : Box;

  // Validate fields, calculate expiration in seconds, and call the create function from the hook
  const handleRegister = async () => {
    if (!hashes) return;

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

          const isTaken = await fetchOwnerAddress(hash);

          if (isTaken) {
            notifyError(ERRORS.ASSET_ALREADY_REGISTERED_ERROR);
            continue;
          }

          if (!isTaken) {
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

  return (
    <>
      <Divider sx={{ padding: '0.3rem 0', mb: 2, borderStyle: 'dashed' }} />
      <Stack direction="column" >
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
      </Stack>
      <Divider sx={{ padding: '0.3rem 0', mt: 2, borderStyle: 'dashed' }} />

      <DialogActions sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
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
            sx={{ backgroundColor: 'white', color: 'black' }}
            onClick={handleRegister}
            disabled={!hashes || isProcessing}
            loading={isProcessing}
            loadingPosition="start"
            startIcon={<Iconify icon="material-symbols:publish" />}
          >
            Confirm
          </LoadingButton>
        </RainbowEffect>
      </DialogActions>
    </>
  );
};

export {OwnershipModalContent};
