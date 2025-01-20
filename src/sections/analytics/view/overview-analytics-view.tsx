// components
import {alpha} from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useState} from "react";
import OverviewAnalyticsGeneralView from "@src/sections/analytics/view/overview-analytics-general-view.tsx";


// ----------------------------------------------------------------------
const TABS = [
  { value: 'general', label: 'General' },
  { value: 'content', label: 'Content' },
  { value: 'public', label: 'Public' },
  { value: 'geography', label: 'Geography' },
];

export default function OverviewAnalyticsView() {
  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = (_event: any, newValue: any) => {
    setCurrentTab(newValue);
  };


  return (
    <>
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        px: 2.5,
        boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
      }}
    >
      {
        TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
            />
        )
        )}
    </Tabs>
    {currentTab === 'general' && (<OverviewAnalyticsGeneralView />)}
    </>
  );
}
