import { useCallback } from 'react';
// @mui
import { Theme, useTheme, alpha, SxProps } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// theme
import { bgGradient } from '@src/theme/css';
// utils
import { fCurrency } from '@src/utils/format-number';
// hooks
import { useBoolean } from '@src/hooks/use-boolean';
// components
import Iconify from '@src/components/iconify';
import CustomPopover, { usePopover } from '@src/components/custom-popover';
import Carousel, { CarouselDots, useCarousel } from '@src/components/carousel';

// ----------------------------------------------------------------------

type ItemProps = {
  id: string;
  cardType: string;
  balance: number;
  cardHolder: string;
  cardNumber: string;
  cardValid: string;
};

type Props = {
  list: ItemProps[];
  sx?: SxProps<Theme>;
};

export default function BankingCurrentBalance({ list, sx }: Props) {
  const theme = useTheme();

  const carousel = useCarousel({
    fade: true,
    speed: 100,
    ...CarouselDots({
      sx: {
        right: 16,
        bottom: 16,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.grey[900], 0.8),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
        height: 262,
        borderRadius: 2,
        position: 'relative',
        color: 'common.white',
        '.slick-slider, .slick-list, .slick-track, .slick-slide > div': {
          height: 1,
        },
        '&:before, &:after': {
          left: 0,
          mx: 2.5,
          right: 0,
          zIndex: -2,
          height: 200,
          bottom: -16,
          content: "''",
          opacity: 0.16,
          borderRadius: 2,
          bgcolor: 'grey.500',
          position: 'absolute',
        },
        '&:after': {
          mx: 1,
          bottom: -8,
          opacity: 0.24,
        },
        ...sx,
      }}
    >
      <Carousel {...carousel.carouselSettings}>
        {list.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </Carousel>
    </Box>
  );
}

// ----------------------------------------------------------------------

type CardItemProps = {
  card: ItemProps;
};

function CardItem({ card }: CardItemProps) {
  const { id, cardType, balance, cardHolder, cardNumber, cardValid } = card;

  const currency = useBoolean();

  const popover = usePopover();

  const handleDelete = useCallback(() => {
    popover.onClose();
    console.info('DELETE', id);
  }, [id, popover]);

  const handleEdit = useCallback(() => {
    popover.onClose();
    console.info('EDIT', id);
  }, [id, popover]);

  return (
    <>
      <Stack justifyContent="space-between" sx={{ height: 1, p: 3 }}>
        <IconButton
          color="inherit"
          onClick={popover.onOpen}
          sx={{
            top: 8,
            right: 8,
            zIndex: 9,
            opacity: 0.48,
            position: 'absolute',
            ...(popover.open && {
              opacity: 1,
            }),
          }}
        >
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2', opacity: 0.48 }}>
            Current Balance
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ typography: 'h3' }}>
              {currency.value ? '********' : fCurrency(balance)}
            </Typography>

            <IconButton color="inherit" onClick={currency.onToggle} sx={{ opacity: 0.48 }}>
              <Iconify icon={currency.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
            </IconButton>
          </Stack>
        </div>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ typography: 'subtitle1' }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              lineHeight: 0,
              px: 0.75,
              borderRadius: 0.5,
              mr: 1,
            }}
          >
            {cardType === 'mastercard' && <Iconify width={24} icon="logos:mastercard" />}
            {cardType === 'visa' && <Iconify width={24} icon="logos:visa" />}
          </Box>
          {cardNumber}
        </Stack>

        <Stack direction="row" spacing={5}>
          <Stack spacing={1}>
            <Typography sx={{ typography: 'caption', opacity: 0.48 }}>Card Holder</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardHolder}</Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography sx={{ typography: 'caption', opacity: 0.48 }}>Valid Dates</Typography>
            <Typography sx={{ typography: 'subtitle1' }}>{cardValid}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>
    </>
  );
}
