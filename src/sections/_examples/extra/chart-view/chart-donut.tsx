// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: number[];
};

export default function ChartDonut({ series }: Props) {
  const chartOptions = useChart({
    labels: ['Apple', 'Mango', 'Orange', 'Watermelon'],
    stroke: {
      show: false,
    },
    legend: {
      horizontalAlign: 'center',
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
        },
      },
    },
  });

  return <Chart dir="ltr" type="donut" series={series} options={chartOptions} width={400} />;
}
