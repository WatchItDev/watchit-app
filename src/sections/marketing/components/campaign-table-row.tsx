// LOCAL IMPORTS
import { useEffect, useMemo } from 'react';

// MUI IMPORTS
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { IconButton, MenuItem } from '@mui/material';

// VIEM IMPORTS
import { formatUnits } from 'viem';

// LOCAL IMPORTS
import Iconify from '@src/components/iconify';
import TextMaxLine from "@src/components/text-max-line";
import CampaignSettingsModal from "@src/sections/marketing/components/campaign-settings-modal.tsx";
import CampaignWithdrawFundsModal from '@src/sections/marketing/components/campaign-withdraw-funds-modal.tsx';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { capitalizeFirstLetter } from '@src/utils/text-transform.ts';
import { useBoolean } from '@src/hooks/use-boolean';
import { useGetCampaignFundsBalance } from '@src/hooks/protocol/use-get-campaign-funds-balance.ts';
import { useGetCampaignFundsAllocation } from '@src/hooks/protocol/use-get-campaign-funds-allocation.ts';
import { useCampaignPaused } from '@src/hooks/protocol/use-campaign-paused.ts';
import { useGetCampaignQuotaLimit } from '@src/hooks/protocol/use-get-campaign-quota-limit.ts';
import { useGetCampaignTotalUsage } from '@src/hooks/protocol/use-get-campaign-total-usage.ts';
import { useCampaignPause } from '@src/hooks/protocol/use-campaign-pause.ts';
import { useCampaignUnPause } from '@src/hooks/protocol/use-campaign-unpause.ts';
import {
  CampaignConfiguredIndicatorState
} from "@src/sections/marketing/components/campaign-configured-indicator-state.tsx";
import { useGetCampaignIsReady } from '@src/hooks/protocol/use-get-campaign-is-ready.ts';
import { CampaignTableRowProps } from '@src/sections/marketing/types.ts';
import { LBL_COLORS, LBL_STATUS_COLORS, POLICY_TEXTS } from '@src/sections/marketing/CONSTANTS.tsx';

// ----------------------------------------------------------------------

export default function CampaignTableRow({ row, selected }: Readonly<CampaignTableRowProps>) {
  const { campaign, name, policy, expiration } = row;
  const popover = usePopover();
  const settingsModal = useBoolean();
  const withdrawModal = useBoolean();
  const { fundsBalance, fetchCampaignFundsBalance } = useGetCampaignFundsBalance();
  const { fundsAllocation, fetchFundsAllocation } = useGetCampaignFundsAllocation();
  const { paused, fetchCampaignPaused } = useCampaignPaused();
  const { quotaLimit, fetchQuotaLimit } = useGetCampaignQuotaLimit();
  const { totalUsage, fetchTotalUsage } = useGetCampaignTotalUsage();
  const { isReady, fetchIsReady } = useGetCampaignIsReady();
  const { pause, loading: loadingPause } = useCampaignPause();
  const { unPause, loading: loadingResume } = useCampaignUnPause();
  const type = POLICY_TEXTS[`${policy?.toLowerCase?.()}`]?.toLowerCase?.();
  const status = paused ? 'paused' : 'active';
  const totalUsageBigInt = BigInt(totalUsage || "0");
  const fundsAllocationBigInt = BigInt(fundsAllocation || "0");
  const totalUsageMMCFormatted = formatUnits(totalUsageBigInt * fundsAllocationBigInt, 18);
  const formattedExpiration = expiration
    ? new Date(Number(expiration) * 1000).toLocaleDateString('es-ES')
    : 'No Expiration';

  const handleFetchCampaignData = () => {
    fetchCampaignFundsBalance(campaign)
    fetchFundsAllocation(campaign)
    fetchQuotaLimit(campaign)
    fetchCampaignPaused(campaign)
    fetchTotalUsage(campaign)
    fetchIsReady(campaign)
  };

  useEffect(() => {
    handleFetchCampaignData()
  }, [campaign]);

  const onSettingRow = () => {
    settingsModal.onTrue();
  };

  const handlePauseToggle = async (checked: boolean) => {
    try {
      checked ? await pause(campaign) : await unPause(campaign);

      fetchCampaignPaused(campaign);
      popover.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccessWithdraw = async () => {
    await fetchCampaignFundsBalance(campaign);
    await fetchIsReady(campaign)
  };

  const pauseIcon = useMemo(() => {
    if (loadingPause || loadingResume) {
      return 'eos-icons:loading';
    }
    if (paused) {
      return 'iconoir:play';
    }
    return 'iconoir:pause';
  }, [loadingPause, loadingResume, paused]);

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} key={campaign}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <CampaignConfiguredIndicatorState isReady={isReady} />
          <ListItemText
            primary={<TextMaxLine line={1}>{name}</TextMaxLine>}
            secondary={<TextMaxLine line={1}>{`${fundsAllocation ? Number(formatUnits(fundsAllocationBigInt, 18)).toFixed(2) : "0"} MMC per user`}</TextMaxLine>}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={`${quotaLimit}`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={`${fundsBalance ? Number(formatUnits(fundsBalance, 18)).toFixed(2) : "0"} MMC`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={<TextMaxLine line={1}>{`${totalUsageMMCFormatted} MMC`}</TextMaxLine>}
            secondary={<TextMaxLine line={1}>{`${totalUsage} Users`}</TextMaxLine>}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
          <Typography variant="body2"></Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{formattedExpiration}</Typography>
        </TableCell>

        <TableCell>
          <Typography
            component={'span'}
            variant="body2"
            sx={{
              color: `${LBL_COLORS?.[type]}`,
              background: `${LBL_COLORS?.[type]}12`,
              borderRadius: 1,
              px: 1,
              py: '2px',
            }}
          >
            {capitalizeFirstLetter(type ?? '')}
          </Typography>
        </TableCell>

        <TableCell>
          <Grid display="flex" alignItems="center" justifyContent="space-between">
            <Typography
              component={'span'}
              variant="body2"
              sx={{
                color: `${LBL_STATUS_COLORS?.[status]}`,
                background: `${LBL_STATUS_COLORS?.[status]}12`,
                borderRadius: 1,
                px: 1,
                py: '2px',
              }}
            >
              {capitalizeFirstLetter(status ?? '')}
            </Typography>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="pixelarticons:more-vertical" />
            </IconButton>
          </Grid>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={() => {
          if (!loadingPause && !loadingResume) {
            popover.onClose();
          }
        }}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            onSettingRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mdi:settings-outline" />
          Configure
        </MenuItem>
        <MenuItem
          onClick={() => {
            withdrawModal.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="ic:outline-account-balance-wallet" />
          Withdraw
        </MenuItem>
        <MenuItem
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Iconify icon={pauseIcon} />
          <Typography variant="body2">
            {paused ? 'Resume' : 'Pause'}
          </Typography>

          <Switch
            color="secondary"
            checked={!paused}
            onChange={async (event) => {
              await handlePauseToggle(!event.target.checked);
            }}
            disabled={loadingPause || loadingResume}
          />
        </MenuItem>
      </CustomPopover>

      <CampaignSettingsModal
        open={settingsModal.value}
        onClose={settingsModal.onFalse}
        onSuccess={handleFetchCampaignData}
        campaignData={{
          address: campaign,
          description: name,
        }}
      />

      <CampaignWithdrawFundsModal
        open={withdrawModal.value}
        onClose={withdrawModal.onFalse}
        onSuccess={handleSuccessWithdraw}
        campaignData={{
          address: campaign,
          description: name,
          currentFundsBalance: fundsBalance ? formatUnits(fundsBalance, 18) : '0',
        }}
      />
    </>
  );

  return <>{renderPrimary}</>;
}
