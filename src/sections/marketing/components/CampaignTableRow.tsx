// @MUI
import Typography from '@mui/material/Typography';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { Button, Divider, IconButton, MenuItem } from '@mui/material';
import Switch from '@mui/material/Switch';

// Project components
import { CampaignTableRowType } from '@src/types/marketing';
import { capitalizeFirstLetter } from '@src/utils/text-transform.ts';
import { COLORS } from '@src/utils/colors.ts';
import Iconify from '@src/components/iconify';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import { useBoolean } from '@src/hooks/use-boolean';
import { ConfirmDialog } from '@src/components/custom-dialog';
import CampaignSettingsModal from "@src/sections/marketing/components/CampaignSettingsModal.tsx";
import { useGetCampaignFundsBalance } from '@src/hooks/use-get-campaign-funds-balance.ts';
import { useEffect } from 'react';
import { Address, formatUnits } from 'viem';
import { useGetCampaignFundsAllocation } from '@src/hooks/use-get-campaign-funds-allocation.ts';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { useCampaignPaused } from '@src/hooks/use-campaign-paused.ts';
import { useGetCampaignQuotaLimit } from '@src/hooks/use-get-campaign-quota-limit.ts';
import { useGetCampaignTotalUsage } from '@src/hooks/use-get-campaign-total-usage.ts';

// ----------------------------------------------------------------------

type Props = {
  row: CampaignTableRowType;
  selected: boolean;
};

const POLICY_TEXTS: Record<string, string> = {
  [`${GLOBAL_CONSTANTS.SUBSCRIPTION_POLICY_ADDRESS.toLowerCase()}`]: "Subscription",
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
  const confirm = useBoolean();
  const settingsModal = useBoolean();
  const { fundsBalance, loading, fetchCampaignFundsBalance, error } = useGetCampaignFundsBalance();
  const { fundsAllocation, loading: loadingAllocation, fetchFundsAllocation, error: errorAllocation } = useGetCampaignFundsAllocation();
  const { paused, loading: loadingPaused, fetchCampaignPaused, error: errorPaused } = useCampaignPaused();
  const { quotaLimit, loading: loadingQuotaLimit, fetchQuotaLimit, error: errorQuotaLimit } = useGetCampaignQuotaLimit();
  const { totalUsage, loading: loadingTotalUsage, fetchTotalUsage, error: errorTotalUsage } = useGetCampaignTotalUsage();
  const type = POLICY_TEXTS[`${policy.toLowerCase()}`].toLowerCase();
  const status = paused ? 'paused' : 'active';

  // console.log('hello campaign balance')
  // console.log(fundsBalance)
  // console.log(loading)
  // console.log(error)
  //
  // console.log('hello campaign balance allocation')
  // console.log(fundsAllocation)
  // console.log(loadingAllocation)
  // console.log(errorAllocation)
  //
  // console.log('hello campaign paused')
  // console.log(paused)
  // console.log(loadingPaused)
  // console.log(errorPaused)
  // console.log('hello quota limit')
  // console.log(quotaLimit)
  // console.log(loadingQuotaLimit)
  // console.log(errorQuotaLimit)
  console.log('hello total usage')
  console.log(totalUsage)
  console.log(loadingTotalUsage)
  console.log(errorTotalUsage)

  useEffect(() => {
    fetchCampaignFundsBalance(campaign as Address)
    fetchFundsAllocation(campaign as Address)
    fetchCampaignPaused(campaign as Address)
    fetchQuotaLimit(campaign as Address)
    fetchTotalUsage(campaign as Address)
  }, []);

  const onSettingRow = () => {
    settingsModal.onTrue();
  };

  const onViewRow = () => {};

  const onEditRow = () => {};

  const onDeleteRow = () => {};

  const onChange = () => {
    setTimeout(() => {
      popover.onClose();
    }, 1000);
  };

  const totalUsageBigInt = BigInt(totalUsage || "0");
  const fundsAllocationBigInt = BigInt(fundsAllocation || "0");
  const totalUsageMMCFormatted = formatUnits(totalUsageBigInt * fundsAllocationBigInt, 18);
  const formattedExpiration = expiration
    ? new Date(Number(expiration) * 1000).toLocaleDateString('es-ES')
    : 'No Expiration';

  const renderPrimary = (
    <>
      <TableRow hover selected={selected} key={campaign}>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={name}
            secondary={`${fundsAllocation} MMC per user`}
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
            primary={`${fundsBalance ? formatUnits(fundsBalance, 18) : "0"} MMC`}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell>
          <Typography variant="body2">{totalUsageMMCFormatted} MMC</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{`${totalUsage} Users`}</Typography>
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
            {capitalizeFirstLetter(type)}
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
              {status}
            </Typography>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="pixelarticons:more-vertical" />
            </IconButton>
          </Grid>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
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
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={() => {
            onViewRow();
          }}
        >
          <Iconify icon="iconoir:pause" />
          Pause
          <Switch color={'secondary'} defaultChecked onChange={onChange} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="mage:edit" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:eye-linear" />
          Deactivate
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={`Deactivate ${name}`}
        content="Are you sure want to deactivate the campaign?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Deactivate
          </Button>
        }
      />

      <CampaignSettingsModal
        open={settingsModal.value}
        onClose={settingsModal.onFalse}
        onConfirm={() => {}}
        campaignData={{
          address: campaign,
          description: name,
        }}
      />
    </>
  );

  return <>{renderPrimary}</>;
}
