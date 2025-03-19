import { Theme } from '@mui/material/styles';
// components
import Iconify from '@src/components/iconify';
import {
  ArrowDownIcon,
  CheckboxIcon,
  CheckboxCheckedIcon,
  CheckboxIndeterminateIcon,
  RadioIcon,
  RadioCheckedIcon,
  RatingIcon,
  TreeViewCollapseIcon,
  TreeViewExpandIcon,
  TreeViewEndIcon,
} from './components/icons';

// ----------------------------------------------------------------------

export function defaultProps(theme: Theme) {
  return {
    MuiAlert: {
      defaultProps: {
        iconMapping: {
          error: <Iconify icon="solar:danger-bold" width={24} />,
          info: <Iconify icon="eva:info-fill" width={24} />,
          success: <Iconify icon="eva:checkmark-circle-2-fill" width={24} />,
          warning: <Iconify icon="eva:alert-triangle-fill" width={24} />,
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiAppBar: {
      defaultProps: {
        color: 'transparent',
      },
    },
    MuiAvatarGroup: {
      defaultProps: {
        max: 4,
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiButton: {
      defaultProps: {
        color: 'inherit',
        disableElevation: true,
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: 'h6' },
        subheaderTypographyProps: {
          variant: 'body2',
          marginTop: theme.spacing(0.5),
        },
      },
    },
    MuiChip: {
      defaultProps: {
        deleteIcon: <Iconify icon="solar:close-circle-bold" />,
      },
    },
    MuiDialogActions: {
      defaultProps: {
        disableSpacing: true,
      },
    },
    MuiFab: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          typography: 'subtitle2',
        },
        secondaryTypographyProps: {
          component: 'span',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
        variant: 'rounded',
      },
    },
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true,
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        component: 'div',
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
        iconPosition: 'start',
      },
    },
    MuiTabs: {
      defaultProps: {
        textColor: 'inherit',
        variant: 'scrollable',
        allowScrollButtonsMobile: true,
      },
    },
    MuiTablePagination: {
      defaultProps: {
        backIconButtonProps: {
          size: 'small',
        },
        nextIconButtonProps: {
          size: 'small',
        },
      },
    },
    MuiSlider: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: <ArrowDownIcon />,
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ArrowDownIcon,
      },
    },
    MuiNativeSelect: {
      defaultProps: {
        IconComponent: ArrowDownIcon,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: 'small',
        icon: <CheckboxIcon />,
        checkedIcon: <CheckboxCheckedIcon />,
        indeterminateIcon: <CheckboxIndeterminateIcon />,
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
        icon: <RadioIcon />,
        checkedIcon: <RadioCheckedIcon />,
      },
    },
    MuiRating: {
      defaultProps: {
        emptyIcon: <RatingIcon />,
        icon: <RatingIcon />,
      },
    },
    MuiTreeView: {
      defaultProps: {
        defaultCollapseIcon: <TreeViewCollapseIcon />,
        defaultExpandIcon: <TreeViewExpandIcon />,
        defaultEndIcon: <TreeViewEndIcon />,
      },
    },
  };
}
