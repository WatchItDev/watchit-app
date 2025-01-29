import { ApexOptions } from 'apexcharts';
import sumBy from 'lodash/sumBy';
// @mui

import { CardProps } from '@mui/material/Card';
// utils
import { fNumber } from '@src/utils/format-number';
// components
import Chart, { useChart } from '@src/components/chart';

// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
};

interface Props extends CardProps {
  colors: {
    start: string;
    end: string;
  };
  chart: {
    series: ItemProps[];
    options?: ApexOptions;
  };
}

export default function StrategyProgress({colors, chart}: Props) {
  const {
    series,
    options,
  } = chart;

  const total = sumBy(series, 'value');

  const chartSeries = (series.filter((i) => i.label === 'Total')[0].value / total) * 100;

  const chartOptions = useChart({
    legend: {
      show: false,
    },
    grid: {
      padding: { top: -16, bottom: -16 },
    },
    fill: {
      type: 'gradient',
      /* @ts-ignore */
      gradient: {
        colorStops: [
          { offset: 0, color: colors.start },
          { offset: 100, color: colors.end },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '55%' },
        dataLabels: {
          name: { offsetY: -16 },
          value: { offsetY: 6 },
          total: {
            label: '',
            formatter: () => fNumber(chartSeries)+'%',
          },
        },
      },
    },
    ...options,
  });

  return (<Chart type="radialBar" series={[chartSeries]} options={chartOptions} width={150}  height={150} />);
}
