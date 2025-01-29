import React, {FC} from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { StrategyType } from '@src/types/marketing';
import {COLORS} from "@src/layouts/config-layout.ts";
import Stack from "@mui/material/Stack";
import {Box, styled} from "@mui/system";
import Iconify from '@src/components/iconify';
import StrategyCircles from '@src/sections/marketing/components/StrategyCircles';
import StrategyProgress from "@src/sections/marketing/components/StrategyProgress.tsx";

interface StrategyListProps {
  data: StrategyType[];
}

const COLORS_LIST = [
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',
  '#00A76F',
  '#00B8D9',
  '#003768',
  '#6d1818',
  '#392996',
  '#B71D18',

];

console.log(COLORS_LIST);

const StrategyList: React.FC<StrategyListProps> = ({ data }) => {

  // Helper to turn darker a given hex color
  const darken = (color: string, tone: number = 30) => {
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.max(0, r - tone);
    g = Math.max(0, g - tone);
    b = Math.max(0, b - tone);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const sumSponsoredAccess = () => {
    return data.reduce((acc, strategy) => {
      return acc + strategy.campaigns.reduce((acc, campaign) => acc + campaign.sponsoredAccess, 0);
    }, 0);
  }

  const getMinMaxDate = () => {
    const dates = data.reduce((acc, strategy) => {
      return acc.concat(strategy.campaigns.flatMap(campaign => [campaign.startDate, campaign.endDate]));
    }, [] as string[]);

    return {
      minDate: new Date(Math.min(...dates.map(date => new Date(date).getTime()))).toISOString().split('T')[0],
      maxDate: new Date(Math.max(...dates.map(date => new Date(date).getTime()))).toISOString().split('T')[0],
    };
  }

  const { minDate, maxDate } = getMinMaxDate();

  return (
    <Grid container spacing={1} sx={{
      mt: 1
    }}>
      {data.map((strategy, index) => (
        <Grid item xs={12} key={index}  sx={{
          background: COLORS.GRAY_DARK
        }}>
          <Card sx={{
            cursor: 'pointer',
            background: COLORS.GRAY_LIGHT,
            '&:hover': {
              background: darken(COLORS.GRAY_LIGHT, 5),
            }
          }}>
            <CustomCardContent
              sx={{
              p: 0,
              display: {
                xs: 'block',
                md: 'flex',
              },
              gap: 2,
              justifyContent: 'space-between',
            }}>


              {/*Metadata*/}
              <Stack minWidth={'calc(40%)'} direction="column" sx={{
                borderRight: '1px dashed rgba(255, 255, 255, 0.2)',
              }}>
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
                    <CounterItem icon={<Iconify width={36} color={'#007AFF'} icon={'material-symbols-light:electric-bolt-outline-rounded'} />} number={strategy.campaigns.length} label="Campaigns"/>
                    <CounterItem icon={<Iconify width={36} color={'#009951'} icon={'ic:outline-trending-up'} />} number={strategy.campaigns.filter(item => item.status ==='active' ).length} label="Active"/>
                    <CounterItem icon={<Iconify width={36} color={'#BF6A02'} icon={'ph:stop-circle-light'} />} number={strategy.campaigns.filter(item => item.status ==='paused' ).length} label="Paused"/>
                  </Box>
                </Box>
              </Stack>


              {/*Sponsored access*/}
              <Stack minWidth={'calc(60%)'} direction="row" spacing={2} sx={{p: 2, display: 'flex', gap: 2}}>

                <Stack spacing={2} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minWidth: 'calc(33.33% - 0.5rem)',
                  background: COLORS.GRAY_DARK,
                  textAlign: 'center',
                  borderRadius: 1.5,
                }}>
                  <Typography variant="body1" sx={{
                    padding: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px dashed rgba(255, 255, 255, 0.5)',
                    color: 'text.secondary'
                  }}>
                    Sponsored access
                  </Typography>

                  <Typography fontSize={'1.8em'} color="text.secondary" sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 2,
                    flexGrow: 1
                  }}>
                    {sumSponsoredAccess()}
                  </Typography>
                </Stack>


                {/*Graph widget*/}

                <Box sx={{
                  background: `linear-gradient(135deg, ${COLORS_LIST[index]} 0%, ${darken(COLORS_LIST[index],120)} 100%)`,
                  width: '90%',
                  borderRadius: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  px: 2,
                  mr: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  fontSize: '1rem'
                }}>
                  <StrategyProgress
                    colors={
                      {
                        start: COLORS_LIST[index],
                        end: darken(COLORS_LIST[index], 50)
                      }
                    }
                    chart={{
                      series: [
                        { label: 'Total', value: strategy.budget },
                        { label: 'Available', value: strategy.available },
                      ]
                    }}
                  />
                    <Typography  color="text.white" fontSize={'2rem'} >
                      <Box component={'small'} sx={{fontSize:'1.2rem', color: '#CCC'}}>Budget</Box>
                      <br/>
                      <Box sx={{fontWeight:'bold'}}>{strategy.budget}</Box>
                    </Typography>

                   <Typography color="text.white" fontSize={'2rem'} sx={{zIndex: 2}}>
                     <Box component={'small'} sx={{fontSize:'1.2rem', color: '#CCC'}}>Available</Box>
                      <br/>
                      <Box sx={{fontWeight:'bold'}}>{strategy.available}</Box>
                    </Typography>
                    <StrategyCircles color={darken(COLORS_LIST[index])} />
                  </Box>

              </Stack>
            </CustomCardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const DateBadge = styled(Box)(({ theme }) => ({
  backgroundColor: '#949BA4',
  color: '#1E1F22',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  display: 'inline-block',
  fontSize: '0.875rem',
  fontWeight: 500,
}));

interface CounterItemProps {
  icon: React.ReactNode;
  number: number;
  label: string;
}
const CounterItem: FC<CounterItemProps> = ({ icon, number,label }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: .3,
      textAlign: 'center',
      p: 2,
      borderRadius: 1.5,
      border: '1px solid rgba(145, 158, 171, 0.16)',
      width: 'calc(33.33% - 0.5rem)',
    }}>
      <Box>
        {icon}
      </Box>
      <Typography variant="h4" sx={{
        color: 'text.secondary'
      }}>
        {number}
      </Typography>
      <Typography variant="body1" sx={{
        color: 'text.secondary'
      }}>
        {label}
      </Typography>
    </Box>
  )
}

const CustomCardContent = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

export default StrategyList;
