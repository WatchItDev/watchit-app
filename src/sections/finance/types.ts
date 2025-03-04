import { Profile } from '@lens-protocol/react';

export interface WidgetDataPoint {
  x: string;
  y: number;
}

export interface SummaryAndActionsProps {
  percent: number;
  widgetSeriesData: WidgetDataPoint[];
  balanceFromRedux: number;
  following: Profile[] | null | undefined;
  loadingProfiles: boolean;
}

export interface LeftColumnContentProps {
  following: Profile[] | null | undefined;
}

export interface RightSidebarProps {
  following: Profile[] | null | undefined;
  loadingProfiles: boolean;
}
