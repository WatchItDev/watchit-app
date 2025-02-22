// LOCAL IMPORTS
import { useEffect } from 'react';

// MUI IMPORTS
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { IconButton, MenuItem } from '@mui/material';
import Switch from '@mui/material/Switch';

// VIEM IMPORTS
import { Address, formatUnits } from 'viem';

// LOCAL IMPORTS
import { CampaignTableRowType } from '@src/types/marketing';
import { capitalizeFirstLetter } from '@src/utils/text-transform.ts';
import { COLORS } from '@src/utils/colors.ts';
import Iconify from '@src/components/iconify';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { useBoolean } from '@src/hooks/use-boolean';
import CampaignSettingsModal from "@src/sections/marketing/components/CampaignSettingsModal.tsx";
import { useGetCampaignFundsBalance } from '@src/hooks/use-get-campaign-funds-balance.ts';
import { useGetCampaignFundsAllocation } from '@src/hooks/use-get-campaign-funds-allocation.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useCampaignPaused } from '@src/hooks/use-campaign-paused.ts';
import { useGetCampaignQuotaLimit } from '@src/hooks/use-get-campaign-quota-limit.ts';
import { useGetCampaignTotalUsage } from '@src/hooks/use-get-campaign-total-usage.ts';
import { useCampaignPause } from '@src/hooks/use-campaign-pause';
import { useCampaignUnPause } from '@src/hooks/use-campaign-unpause';
import {
  CampaignConfiguredIndicatorState
} from "@src/sections/marketing/components/CampaignConfiguredIndicatorState.tsx";
import TextMaxLine from "@src/components/text-max-line";
import CampaignWithdrawFundsModal from '@src/sections/marketing/components/CampaignWithdrawFundsModal';
import { useGetCampaignIsReady } from '@src/hooks/use-get-campaign-is-ready.ts';

// ----------------------------------------------------------------------

type Props = {
  row: CampaignTableRowType;
  selected: boolean;
};

// ----------------------------------------------------------------------

const POLICY_TEXTS: Record<string, string> = {
  [`${GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS?.toLowerCase?.()}`]: "Subscription",
};

const LBL_COLORS = {
  subscription: COLORS.info,
  rental: COLORS.info,
  trial: COLORS.warning,
  custom: COLORS.danger,
};

const LBL_STATUS_COLORS = {
  active: COLORS.success,
  paused: COLORS.warning,
  completed: COLORS.warning,
};

// ----------------------------------------------------------------------

export default function CampaignTableRow({ row, selected }: Props) {
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
    fetchCampaignFundsBalance(campaign as Address)
    fetchFundsAllocation(campaign as Address)
    fetchQuotaLimit(campaign as Address)
    fetchCampaignPaused(campaign as Address)
    fetchTotalUsage(campaign as Address)
    fetchIsReady(campaign as Address)
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

      fetchCampaignPaused(campaign as Address);
      popover.onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSuccessWithdraw = async () => {
    await fetchCampaignFundsBalance(campaign as Address);
    await fetchIsReady(campaign as Address)
  };

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
          <Iconify icon={loadingPause || loadingResume ? 'eos-icons:loading': paused ? 'iconoir:play' : 'iconoir:pause'} />
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
          address: campaign as Address,
          description: name,
          currentFundsBalance: fundsBalance ? formatUnits(fundsBalance, 18) : '0',
        }}
      />
    </>
  );

  return <>{renderPrimary}</>;
}
