// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = {
  series: {
    name: string;
    data: number[];
  }[];
};

export default function ChartColumnMultiple({ series }: Props) {
  const chartOptions = useChart({
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$ ${value} thousands`,
      },
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return <Chart dir="ltr" type="bar" series={series} options={chartOptions} height={320} />;
}
