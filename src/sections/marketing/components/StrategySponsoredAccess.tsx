import {FC} from "react";

// MUI components
import {Typography} from "@mui/material";
import Stack from "@mui/material/Stack";

// Types
import {COLORS} from "@src/layouts/config-layout.ts";
import {CampaignType} from "@src/types/marketing.ts";

interface StrategySponsoredAccessProps {
  data: CampaignType[];
}

const StrategySponsoredAccess: FC<StrategySponsoredAccessProps> = ({data}) => {

  const sumSponsoredAccess = () => {
    return data.reduce((acc, campaign) => {
      return acc + parseInt(campaign.access);
    }, 0);
  }

  return (<Stack spacing={{xs: 0, md: 2}}
  sx={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minWidth: 'calc(33.33% - 0.5rem)',
    background: COLORS.GRAY_DARK,
    textAlign: 'center',
    borderRadius: 1.5,
  }}>
    <Typography variant="body1" sx={{
      padding: {
        xs: 0.8,
        md: 3,
      },
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px dashed rgba(255, 255, 255, 0.5)',
      color: 'text.secondary'
    }}>
      Sponsored access
    </Typography>

    <Typography fontWeight={'bold'} fontSize={
      {
        xs: '1.5rem',
        md: '2rem'
      }
    } color="text.secondary" sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: {
        xs: .5,
        md: 2,
      },
      flexGrow: 1
    }}>
      {sumSponsoredAccess()}
    </Typography>
  </Stack>)
}

export default StrategySponsoredAccess;
