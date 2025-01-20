// @mui
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

// components
import AnalyticsCurrentVisits from '../analytics-current-visits';
import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
import AnalyticsCurrentSubject from '../analytics-current-subject';
import AnalyticsConversionRates from '../analytics-conversion-rates';

// Icons images
// @ts-ignore
import iconGlassBag from '@src/assets/mmc_token.ico';
// @ts-ignore
import iconGlassUsers from '@src/assets/icons/glass/ic_glass_users.png';
// @ts-ignore
import iconGlassBuy from '@src/assets/icons/glass/ic_glass_buy.png';
// @ts-ignore
import iconGlassMessage from '@src/assets/icons/glass/ic_glass_message.png';

// ----------------------------------------------------------------------

export default function OverviewAnalyticsGeneralView() {

  return (

    <Container
      sx={{
        marginTop: { xs: '1rem', md: '2rem' },
        marginBottom: '2rem',
        maxWidth: '100% !important',
      }}
    >
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Income"
            total={714000}
            icon={<img alt="icon" src={iconGlassBag} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Subscribers"
            total={1352831}
            color="info"
            icon={<img alt="icon" src={iconGlassUsers} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Content Orders"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src={iconGlassBuy} />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Time played"
            total={234}
            color="error"
            icon={<img alt="icon" src={iconGlassMessage} />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsWebsiteVisits
            title="Content visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                }
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Top Countries visits"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Genres Popularity"
            chart={{
              categories: ['Comedy','Horror','Drama','Action','Sci-Fi','Documentary'],
              series: [
                { name: 'America', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Europe', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Asia', data: [44, 76, 78, 13, 43, 10] },
                { name: 'Africa', data: [44, 20, 100, 47, 78, 10] },
              ],
            }}
          />
        </Grid>

        {/*<Grid xs={12} md={6} lg={8}>
          <AnalyticsNews title="News" list={_analyticPosts} />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Subscribers Timeline" list={_analyticOrderTimeline} />
        </Grid>*/}
      </Grid>
    </Container>
  );
}
