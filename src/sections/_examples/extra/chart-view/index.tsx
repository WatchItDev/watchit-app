// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ChartPie from './chart-pie';
import ChartBar from './chart-bar';
import ChartLine from './chart-line';
import ChartArea from './chart-area';
import ChartMixed from './chart-mixed';
import ChartDonut from './chart-donut';
import ChartsRadarBar from './chart-radar-bar';
import ChartRadialBar from './chart-radial-bar';
import ChartColumnSingle from './chart-column-single';
import ChartColumnStacked from './chart-column-stacked';
import ChartColumnNegative from './chart-column-negative';
import ChartColumnMultiple from './chart-column-multiple';

// ----------------------------------------------------------------------

export default function ChartView() {
  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Chart"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Chart' },
            ]}
            moreLink={['https://apexcharts.com']}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Card>
            <CardHeader title="Area" />
            <CardContent>
              <ChartArea
                series={[
                  { name: 'series1', data: [31, 40, 28, 51, 42, 109, 100] },
                  { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41] },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Line" />
            <CardContent>
              <ChartLine
                series={[
                  {
                    name: 'Desktops',
                    data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Column Single" />
            <CardContent>
              <ChartColumnSingle
                series={[
                  {
                    name: 'Net Profit',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Column Multiple" />
            <CardContent>
              <ChartColumnMultiple
                series={[
                  {
                    name: 'Net Profit',
                    data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
                  },
                  {
                    name: 'Revenue',
                    data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Column Stacked" />
            <CardContent>
              <ChartColumnStacked
                series={[
                  { name: 'Product A', data: [44, 55, 41, 67, 22, 43] },
                  { name: 'Product B', data: [13, 23, 20, 8, 13, 27] },
                  { name: 'Product C', data: [11, 17, 15, 15, 21, 14] },
                  { name: 'Product D', data: [21, 7, 25, 13, 22, 8] },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Column Negative" />
            <CardContent>
              <ChartColumnNegative
                series={[
                  {
                    name: 'Cash Flow',
                    data: [
                      1.45, 5.42, 5.9, -0.42, -12.6, -18.1, -18.2, -14.16, -11.1, -6.09, 0.34, 3.88,
                      13.07, 5.8, 2, 7.37, 8.1, 13.57, 15.75, 17.1, 19.8, -27.03, -54.4, -47.2,
                      -43.3, -18.6, -48.6, -41.1, -39.6, -37.6, -29.4, -21.4, -2.4,
                    ],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Bar" />
            <CardContent>
              <ChartBar series={[400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Mixed" />
            <CardContent>
              <ChartMixed
                series={[
                  {
                    name: 'Team A',
                    type: 'column',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Team B',
                    type: 'area',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Team C',
                    type: 'line',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Pie" />
            <CardContent
              sx={{
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChartPie series={[44, 55, 13, 43]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Donut" />
            <CardContent
              sx={{
                height: 420,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChartDonut series={[44, 55, 13, 43]} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Radial Bar" sx={{ mb: 5 }} />
            <ChartRadialBar series={[44, 55]} />
          </Card>

          <Card>
            <CardHeader title="Radar" sx={{ mb: 5 }} />
            <ChartsRadarBar
              series={[
                {
                  name: 'Series 1',
                  data: [80, 50, 30, 40, 100, 20],
                },
                {
                  name: 'Series 2',
                  data: [20, 30, 40, 80, 20, 80],
                },
                {
                  name: 'Series 3',
                  data: [44, 76, 78, 13, 43, 10],
                },
              ]}
            />
          </Card>
        </Box>
      </Container>
    </>
  );
}
