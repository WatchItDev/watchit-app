// REACT IMPORTS
import { useState, useEffect } from "react";

// MUI IMPORTS
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import ButtonBase from "@mui/material/ButtonBase";
import CardHeader from "@mui/material/CardHeader";
import Card from "@mui/material/Card";

// LOCAL IMPORTS
import Iconify from "@src/components/iconify";
import Chart, { useChart } from "@src/components/chart";
import CustomPopover, { usePopover } from "@src/components/custom-popover";
import useGetSmartWalletTransactions from "@src/hooks/protocol/use-get-smart-wallet-transactions.ts";
import FinanceOverlayLoader from "@src/sections/finance/components/finance-overlay-loader.tsx";
import {
  FINANCE_STATISTICS_INFLOW_EVENTS,
  FINANCE_STATISTICS_OUTFLOW_EVENTS,
} from "@src/sections/finance/CONSTANTS.tsx";
import { TransactionLog } from "@redux/transactions";

// ----------------------------------------------------------------------

export default function FinanceBalanceStatistics() {
  const { transactions, loading } = useGetSmartWalletTransactions();
  const popover = usePopover();
  const [timeFrame, setTimeFrame] = useState<"Week" | "Month" | "Year">("Week");
  const [inflowData, setInflowData] = useState<number[]>([]);
  const [outflowData, setOutflowData] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [fullCategories, setFullCategories] = useState<string[]>([]);

  // Initialize chart options with short labels and detailed tooltips
  const chartOptions = useChart({
    colors: ["#00AB55", "#FF4842"], // Green for income, red for outflows
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories, // Short labels
    },
    yaxis: {
      labels: {
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} MMC`, // Value format
      },
      x: {
        formatter: (_, { dataPointIndex }) => {
          const fullLabel = fullCategories[dataPointIndex];
          if (fullLabel && fullLabel.includes("-")) {
            // Timeframe "Week" or "Month"
            const [start, end] = fullLabel.split("-").map((part) => part.trim());
            return `From ${start} to ${end}`; // Example: "From Dec 15 to Dec 21" or "From Dec 29 to Jan 4"
          } else {
            // Timeframe "Year"
            return fullLabel || "No data available";
          }
        },
      },
    },
  });

  useEffect(() => {
    if (!transactions || loading) return;

    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    // Grouped data structure
    const groupedData: Record<string, { label: string; inflow: number; outflow: number }> = {};

    transactions.forEach((log: TransactionLog) => {
      const timestamp = Number(log.timestamp) * 1000;

      // Filter transactions based on the selected timeframe
      if (
        (timeFrame === "Week" && timestamp < oneWeekAgo) ||
        (timeFrame === "Month" && timestamp < oneMonthAgo) ||
        (timeFrame === "Year" && timestamp < oneYearAgo)
      ) {
        return; // Ignore transactions outside the range
      }

      const date = new Date(timestamp);
      let key: string;
      let label: string;

      const weekStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay(),
      );
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

      switch (timeFrame) {
        case "Week":
          // Group by day
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          label = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          break;

        case "Month":
          // Group by week
          key = weekStart.getTime().toString();
          label = `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
          break;

        case "Year":
          // Group by month
          key = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          label = key;
          break;

        default:
          throw new Error(`Unknown timeframe: ${timeFrame}`);
      }

      // Initialize group if it does not exist
      if (!groupedData[key]) {
        groupedData[key] = { label, inflow: 0, outflow: 0 };
      }

      const amount = parseFloat(log.formattedAmount);
      const eventType = log.event;

      // Sort the event using the defined lists
      if (FINANCE_STATISTICS_INFLOW_EVENTS.includes(eventType)) {
        groupedData[key].inflow += amount;
      } else if (FINANCE_STATISTICS_OUTFLOW_EVENTS.includes(eventType)) {
        groupedData[key].outflow += amount;
      } else {
        console.warn(`Unclassified event: ${eventType}`);
      }
    });

    // Sort the keys chronologically
    const sortedKeys = Object.keys(groupedData).sort((a, b) => {
      let dateA: number;
      let dateB: number;

      // Convert keys to timestamps for comparison
      if (/^\d+$/.test(a)) {
        dateA = Number(a);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(a) || /^[A-Za-z]{3} \d{4}$/.test(a)) {
        dateA = new Date(a).getTime();
      } else {
        dateA = new Date(a).getTime();
      }

      if (/^\d+$/.test(b)) {
        dateB = Number(b);
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(b) || /^[A-Za-z]{3} \d{4}$/.test(b)) {
        dateB = new Date(b).getTime();
      } else {
        dateB = new Date(b).getTime();
      }

      return dateA - dateB;
    });

    // Extract full tags for tooltips
    const sortedFullCategories = sortedKeys.map((key) => groupedData[key]?.label || "");

    // Generate short labels for the X axis
    const shortLabels = sortedKeys.map((key) => {
      const label = groupedData[key]?.label || "";
      if (timeFrame === "Month" && label.includes("-")) {
        const [start, end] = label.split("-").map((part) => part.trim());
        const [startMonth, startDay] = start.split(" ");
        const [endMonth, endDay] = end.split(" ");

        if (startMonth === endMonth) {
          return `${startMonth} ${startDay}-${endDay}`; // "Dec 1-7"
        } else {
          return `${startMonth} ${startDay}-${endMonth} ${endDay}`; // "Dec 29-Jan 4"
        }
      }
      return label || "";
    });

    setFullCategories(sortedFullCategories);
    setCategories(shortLabels);
    setInflowData(sortedKeys.map((key) => groupedData[key]?.inflow || 0));
    setOutflowData(sortedKeys.map((key) => groupedData[key]?.outflow || 0));
  }, [transactions, timeFrame, loading]);

  const handleChangeTimeFrame = (newValue: "Week" | "Month" | "Year") => {
    popover.onClose();
    setTimeFrame(newValue);
  };

  return (
    <>
      <Card>
        <CardHeader
          title="Statistics"
          subheader="Inflow vs outflow"
          sx={{ px: 0 }}
          action={
            <ButtonBase
              onClick={popover.onOpen}
              sx={{
                pl: 1,
                py: 0.5,
                pr: 1,
                mr: "8px",
                borderRadius: 1,
                typography: "subtitle2",
                bgcolor: "background.neutral",
              }}>
              {timeFrame}
              <Iconify
                width={16}
                icon={popover.open ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill"}
                sx={{ ml: 0.5 }}
              />
            </ButtonBase>
          }
        />

        <Box data-testid="balance-statistics" sx={{ mt: 3, mx: 0, position: "relative" }}>
          {loading && <FinanceOverlayLoader />}
          <Chart
            dir="ltr"
            type="bar"
            series={[
              { name: "Inflow", data: inflowData },
              { name: "Outflow", data: outflowData },
            ]}
            options={chartOptions}
            height={364}
          />
        </Box>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {(["Week", "Month", "Year"] as const).map((option) => (
          <MenuItem
            key={option}
            selected={option === timeFrame}
            onClick={() => handleChangeTimeFrame(option)}>
            {option}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
