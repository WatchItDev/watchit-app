import { Theme } from '@mui/material/styles';
import { buttonClasses } from '@mui/material/Button';
// components
import Iconify from '@src/components/iconify';

// ----------------------------------------------------------------------

const dateList = [
  'DatePicker',
  'DateTimePicker',
  'StaticDatePicker',
  'DesktopDatePicker',
  'DesktopDateTimePicker',
  //
  'MobileDatePicker',
  'MobileDateTimePicker',
];

const timeList = [
  'TimePicker',
  'MobileTimePicker',
  'StaticTimePicker',
  'DesktopTimePicker',
];

const switchIcon = () => <Iconify icon="eva:chevron-down-fill" width={24} />;

const leftIcon = () => <Iconify icon="eva:arrow-ios-back-fill" width={24} />;

const rightIcon = () => (
  <Iconify icon="eva:arrow-ios-forward-fill" width={24} />
);

const calendarIcon = () => (
  <Iconify icon="solar:calendar-mark-bold-duotone" width={24} />
);

const clockIcon = () => (
  <Iconify icon="solar:clock-circle-outline" width={24} />
);

interface DatePickerSlots {
  openPickerIcon?: () => JSX.Element;
  leftArrowIcon?: () => JSX.Element;
  rightArrowIcon?: () => JSX.Element;
  switchViewIcon?: () => JSX.Element;
}

interface DatePickerComponentConfig {
  defaultProps: {
    slots: DatePickerSlots;
  };
}

type DatePickerComponents = Record<
  `Mui${(typeof dateList)[number]}`,
  DatePickerComponentConfig
>;

type TimePickerComponents = Record<
  `Mui${(typeof timeList)[number]}`,
  DatePickerComponentConfig
>;

const desktopTypes = dateList.reduce<DatePickerComponents>(
  (result, currentValue) => {
    result[`Mui${currentValue}`] = {
      defaultProps: {
        slots: {
          openPickerIcon: calendarIcon,
          leftArrowIcon: leftIcon,
          rightArrowIcon: rightIcon,
          switchViewIcon: switchIcon,
        },
      },
    };

    return result;
  },
  {} as DatePickerComponents,
);

const timeTypes = timeList.reduce<TimePickerComponents>(
  (result, currentValue) => {
    result[`Mui${currentValue}`] = {
      defaultProps: {
        slots: {
          openPickerIcon: clockIcon,
          rightArrowIcon: rightIcon,
          switchViewIcon: switchIcon,
        },
      },
    };

    return result;
  },
  {} as TimePickerComponents,
);

export function datePicker(theme: Theme) {
  return {
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          '& .MuiPickersLayout-actionBar': {
            [`& .${buttonClasses.root}:last-of-type`]: {
              backgroundColor: theme.palette.text.primary,
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.common.white
                  : theme.palette.grey[800],
            },
          },
        },
      },
    },

    // Date
    ...desktopTypes,

    // Time
    ...timeTypes,
  };
}
