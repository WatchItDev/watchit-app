// ----------------------------------------------------------------------

export type DateRangePickerProps = {
  startDate: Date | null;
  endDate: Date | null;
  onChangeStartDate: (newValue: Date | null) => void;
  onChangeEndDate: (newValue: Date | null) => void;
  //
  open: boolean;
  onOpen?: VoidFunction;
  onClose: VoidFunction;
  onReset?: VoidFunction;
  //
  selected?: boolean;
  error?: boolean;
  //
  label?: string;
  shortLabel?: string;
  //
  title?: string;
  variant?: 'calendar' | 'input';
  //
  setStartDate?: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate?: React.Dispatch<React.SetStateAction<Date | null>>;
};
