import {COLORS} from "@src/layouts/config-layout.ts";

import {Card, CardContent, Grid} from "@mui/material";
import {styled} from "@mui/system";

import {darken} from "@src/utils/colors.ts";
import StrategyGeneralInfo from "@src/sections/marketing/components/SrategyGeneralInfo.tsx";
import StrategySponsoredAccess from "@src/sections/marketing/components/StrategySponsoredAccess.tsx";
import StrategyGraphIndicators from "@src/sections/marketing/components/StrategyGraphIndicators.tsx";
import {StrategyType} from "@src/types/marketing";
import {useRouter} from "@src/routes/hooks";
import {paths} from "@src/routes/paths.ts";

interface StrategyItemProps {
  strategy: StrategyType;
  index: number;
}

const StrategyItem = ({strategy, index}: StrategyItemProps) => {
  const router = useRouter();
  const goToStrategy = (id: string) => {
    id && router.push(paths.dashboard.user.strategy(id));
  };

  return (<Grid
    onClick={() => goToStrategy(strategy.id)}
    item
    xs={12}
    key={index}
    sx={{
      background: COLORS.GRAY_DARK,
    }}
  >
    <Card
      sx={{
        cursor: 'pointer',
        background: COLORS.GRAY_LIGHT,
        '&:hover': {
          background: darken(COLORS.GRAY_LIGHT, 5),
        },
      }}
    >
      <CustomCardContent
        sx={{
          p: 0,
          display: {
            xs: 'block',
            md: 'flex',
          },
          justifyContent: 'space-between',
        }}
      >
        <Grid
          sm={12}
          md={4}
          direction="column"
          sx={{
            borderRight: {
              xs: 'none',
              md: `1px dashed rgba(255, 255, 255, 0.2)`,
            },
          }}
        >
          <StrategyGeneralInfo strategy={strategy} />
        </Grid>

        <Grid
          sm={12}
          md={8}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          direction={{
            xs: 'column',
            md: 'row',
          }}
        >
          <Grid
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              flexGrow: 1,
              justifyContent: 'space-between',
              textAlign: 'center',
              borderRadius: 1.5,
              p: 2,
              gap: 2,
            }}
          >
            <StrategySponsoredAccess data={strategy.campaigns} />
            <StrategyGraphIndicators index={index} strategy={strategy} />
          </Grid>
        </Grid>
      </CustomCardContent>
    </Card>
  </Grid>)
}

const CustomCardContent = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

export default StrategyItem;
