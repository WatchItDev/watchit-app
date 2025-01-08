// React imports
import { useState, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Card from '@mui/material/Card';

// Project imports
import Iconify from '@src/components/iconify';
import Chart, { useChart } from '@src/components/chart';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import useGetSmartWalletTransactions from '@src/hooks/use-get-smart-wallet-transactions.ts';
import FinanceOverlayLoader from '@src/sections/finance/components/finance-overlay-loader.tsx';

export default function FinanceBalanceStatistics() {
  const { transactions, loading } = useGetSmartWalletTransactions();
  const popover = usePopover();
  const [timeFrame, setTimeFrame] = useState('Week');
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [outcomeData, setOutcomeData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [fullCategories, setFullCategories] = useState<string[]>([]);

  // Initialize chart options with short labels and detailed tooltips
  const chartOptions = useChart({
    colors: ['#00AB55', '#FF4842'], // Green for income, red for outcome
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories, // Short labels
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} MMC`, // Value format
      },
      x: {
        formatter: (_, { dataPointIndex }) => {
          const fullLabel = fullCategories[dataPointIndex];
          if (fullLabel && fullLabel.includes('-')) {
            // Timeframe "Week" or "Month"
            const [start, end] = fullLabel.split('-').map((part) => part.trim());
            return `From ${start} to ${end}`; // Example: "From Dec 15 to Dec 21" or "From Dec 29 to Jan 4"
          } else {
            // Timeframe "Year"
            return fullLabel || 'No data available';
          }
        },
      },
    },
  });

  // Generate labels in useEffect
  useEffect(() => {
    if (!transactions || loading) return;

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    // Grouped data structure: key is timestamp for "Week" and "Month", string for "Year"
    let groupedData: Record<number | string, { label: string; income: number; outcome: number }> =
      {};

    if (timeFrame === 'Week') {
      // Group data by each day in the last week
      groupedData = transactions.reduce((acc: any, log: any) => {
        const timestamp = Number(log.timestamp) * 1000;
        if (timestamp < oneWeekAgo) return acc;

        const date = new Date(timestamp);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateKey = `${y}-${m}-${d}`;

        const dayLabel = date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

        const amount = parseFloat(log.formattedAmount);
        const eventType = log.event;

        if (!acc[dateKey]) acc[dateKey] = { label: dayLabel, income: 0, outcome: 0 };

        if (eventType === 'transferFrom' || eventType === 'deposit') {
          acc[dateKey].income += amount;
        } else if (eventType === 'transferTo' || eventType === 'withdraw') {
          acc[dateKey].outcome += amount;
        }

        return acc;
      }, {});
    } else if (timeFrame === 'Month') {
      // Group data by week within the last month
      groupedData = transactions.reduce((acc: any, log: any) => {
        const timestamp = Number(log.timestamp) * 1000;
        if (timestamp < oneMonthAgo) return acc;

        const date = new Date(timestamp);
        const weekStart = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() - date.getDay()
        );
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

        const weekStartTimestamp = weekStart.getTime();

        const label = `${weekStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

        const amount = parseFloat(log.formattedAmount);
        const eventType = log.event;

        if (!acc[weekStartTimestamp]) {
          acc[weekStartTimestamp] = { label, income: 0, outcome: 0 };
        }

        if (eventType === 'transferTo' || eventType === 'deposit') {
          acc[weekStartTimestamp].income += amount;
        } else if (eventType === 'transferFrom') {
          acc[weekStartTimestamp].outcome += amount;
        }

        return acc;
      }, {});
    } else if (timeFrame === 'Year') {
      // Group data by each month in the last year
      groupedData = transactions.reduce((acc: any, log: any) => {
        const timestamp = Number(log.timestamp) * 1000;
        if (timestamp < oneYearAgo) return acc;

        const date = new Date(timestamp);
        const monthLabel = date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });

        const amount = parseFloat(log.formattedAmount);
        const eventType = log.event;

        if (!acc[monthLabel]) acc[monthLabel] = { label: monthLabel, income: 0, outcome: 0 };

        if (eventType === 'transferTo' || eventType === 'deposit') {
          acc[monthLabel].income += amount;
        } else if (eventType === 'transferFrom') {
          acc[monthLabel].outcome += amount;
        }

        return acc;
      }, {});
    }

    // Sort keys chronologically
    // - When the key is a number (timestamp) we can compare directly
    // - When it is a string of type 'YYYY-MM-DD', we convert to date
    // - When it is 'Dec 2024' (in Year), we convert to Date with new Date(...).getTime()
    const sortedKeys = Object.keys(groupedData)
      .map((key) => {
        // For year: "Dec 2024" => new Date("Dec 1, 2024")
        // For "YYYY-MM-DD": new Date("YYYY-MM-DD")
        // For timestamps (number), we convert it to number
        if (/^\d+$/.test(key)) {
          return Number(key);
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
          return key; // "2024-12-31" - we sort it as a date string afterwards
        }
        // assumes it is e.g. "Dec 2024"
        return key;
      })
      .sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        if (
          typeof a === 'string' &&
          a.match(/^\d{4}-\d{2}-\d{2}$/) &&
          typeof b === 'string' &&
          b.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          return new Date(a).getTime() - new Date(b).getTime();
        }
        if (typeof a === 'string' && typeof b === 'string') {
          return new Date(a).getTime() - new Date(b).getTime();
        }
        return 0;
      });

    // Extract full labels for tooltips
    const sortedFullCategories = sortedKeys.map((key) => groupedData[key].label);
    setFullCategories(sortedFullCategories);

    // Generate short labels for the X-axis
    const shortLabels = sortedKeys.map((key) => {
      const label = groupedData[key].label;
      if (timeFrame === 'Month') {
        if (label && label.includes('-')) {
          const [start, end] = label.split('-').map((part) => part.trim());
          const startParts = start.split(' '); // ['Dec', '1']
          const endParts = end.split(' '); // ['Dec', '7'] or ['Jan', '4']

          const startMonth = startParts[0];
          const startDay = startParts[1];
          const endMonth = endParts[0];
          const endDay = endParts[1];

          if (startMonth === endMonth) {
            return `${startMonth} ${startDay}-${endDay}`; // "Dec 1-7"
          } else {
            return `${startMonth} ${startDay}-${endMonth} ${endDay}`;
          }
        }
      }
      if (timeFrame === 'Week') {
        return label || '';
      }
      if (timeFrame === 'Year') {
        return label || '';
      }
      return label;
    });

    setCategories(shortLabels);
    setIncomeData(sortedKeys.map((key) => groupedData[key].income));
    setOutcomeData(sortedKeys.map((key) => groupedData[key].outcome));
  }, [transactions, timeFrame, loading]);

  const handleChangeTimeFrame = (newValue: string) => {
    popover.onClose();
    setTimeFrame(newValue);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Balance Statistics"
          subheader="Income vs Outcome over time"
          sx={{ px: 0 }}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 1,
                mr: '8px',
                borderRadius: 1,
                typography: 'subtitle2',
                bgcolor: 'background.neutral',
              }}
            >
              {timeFrame}
              <Iconify
                width={16}
                icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        <Box sx={{ mt: 3, mx: 0, position: 'relative' }}>
          {loading && <FinanceOverlayLoader />}
          <Chart
            dir="ltr"
            type="bar"
            series={[
              { name: 'Income', data: incomeData },
              { name: 'Outcome', data: outcomeData },
            ]}
            options={chartOptions}
            height={364}
          />
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {['Week', 'Month', 'Year'].map((option) => (
          <MenuItem
            key={option}
            selected={option === timeFrame}
            onClick={() => handleChangeTimeFrame(option)}
          >
            {option}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
