// @mui
import { useTheme } from '@mui/material/styles';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartColumnNegative({ series }: Props) {
  const theme = useTheme();

  const chartOptions = useChart({
    stroke: { show: false },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(0)}%`,
      },
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2011-01-01',
        '2011-02-01',
        '2011-03-01',
        '2011-04-01',
        '2011-05-01',
        '2011-06-01',
        '2011-07-01',
        '2011-08-01',
        '2011-09-01',
        '2011-10-01',
        '2011-11-01',
        '2011-12-01',
        '2012-01-01',
        '2012-02-01',
        '2012-03-01',
        '2012-04-01',
        '2012-05-01',
        '2012-06-01',
        '2012-07-01',
        '2012-08-01',
        '2012-09-01',
        '2012-10-01',
        '2012-11-01',
        '2012-12-01',
        '2013-01-01',
        '2013-02-01',
        '2013-03-01',
        '2013-04-01',
        '2013-05-01',
        '2013-06-01',
        '2013-07-01',
        '2013-08-01',
        '2013-09-01',
      ],
    },
    plotOptions: {
      bar: {
        columnWidth: '58%',
        colors: {
          ranges: [
            { from: -100, to: -46, color: theme.palette.warning.main },
            { from: -45, to: 0, color: theme.palette.info.main },
          ],
        },
      },
    },
  });

  return <Chart dir="ltr" type="bar" series={series} options={chartOptions} height={320} />;
}
