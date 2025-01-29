import {Typography} from "@mui/material";
import {Box, styled} from "@mui/system";
import StrategyCounterItem from "@src/sections/marketing/components/StrategyCounterItem.tsx";
import Iconify from "@src/components/iconify";
import {FC} from "react";
import {StrategyType} from "@src/types/marketing.ts";

interface StrategyGeneralInfoProps {
  strategy: StrategyType;
}

const StrategyGeneralInfo: FC<StrategyGeneralInfoProps> = ({strategy}) => {

  const getMinMaxDate = () => {
    const dates = strategy.campaigns.flatMap(campaign => [new Date(campaign.startDate), new Date(campaign.endDate)]);
    const minDate = new Date(Math.min(...dates.map(date => date.getTime()))).toISOString().split('T')[0];
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime()))).toISOString().split('T')[0];
    return { minDate, maxDate };
  }

  const { minDate, maxDate } = getMinMaxDate();

  return (
    <Box sx={{p: 2}}>
      <Typography variant="body1" sx={{pb: 1.5}}>
        {strategy.name}
      </Typography>
      <Box color="text.secondary" display={'flex'} gap={1}>
        <DateBadge>Start date: {minDate}</DateBadge>
        <DateBadge>End date: {maxDate}</DateBadge>
      </Box>
      <Box sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        py: 0
      }} >
        <StrategyCounterItem icon={<Iconify width={36} color={'#007AFF'} icon={'material-symbols-light:electric-bolt-outline-rounded'} />} number={strategy.campaigns.length} label="Campaigns"/>
        <StrategyCounterItem icon={<Iconify width={36} color={'#009951'} icon={'ic:outline-trending-up'} />} number={strategy.campaigns.filter(item => item.status ==='active' ).length} label="Active"/>
        <StrategyCounterItem icon={<Iconify width={36} color={'#BF6A02'} icon={'ph:stop-circle-light'} />} number={strategy.campaigns.filter(item => item.status ==='paused' ).length} label="Paused"/>
      </Box>
    </Box>
  )
}

const DateBadge = styled(Box)(({ theme }) => ({
  backgroundColor: '#949BA4',
  color: '#1E1F22',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

export default StrategyGeneralInfo;
