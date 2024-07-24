// @mui
import Masonry from '@mui/lab/Masonry';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button, { buttonClasses } from '@mui/material/Button';
// components
import Iconify from 'src/components/iconify';
//
import ComponentBlock from '../../component-block';

// ----------------------------------------------------------------------

const COLORS = ['inherit', 'primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

const SIZES = ['small', 'medium', 'large'] as const;

// ----------------------------------------------------------------------

type Props = {
  variant?: 'text' | 'contained' | 'outlined' | 'soft';
};

export default function ButtonVariant({ variant = 'text' }: Props) {
  return (
    <Masonry
      columns={2}
      spacing={3}
      sx={{
        [`& .${buttonClasses.root}`]: {
          textTransform: 'capitalize',
        },
      }}
    >
      <ComponentBlock title="Base" spacing={1}>
        <Button variant={variant} color="inherit">
          Default
        </Button>

        <Button variant={variant} color="primary">
          Primary
        </Button>

        <Button variant={variant} color="secondary">
          Secondary
        </Button>

        <Button variant={variant} disabled>
          Disabled
        </Button>

        <Button variant={variant}>Link</Button>
      </ComponentBlock>

      <ComponentBlock title="Colors" spacing={1}>
        {COLORS.map((color) => (
          <Button key={color} variant={variant} color={color}>
            {color === 'inherit' ? 'default' : color}
          </Button>
        ))}
      </ComponentBlock>

      <ComponentBlock title="With Icon & Loading" spacing={1}>
        <Button
          variant={variant}
          color="error"
          startIcon={<Iconify icon="ic:round-access-alarm" />}
        >
          Icon Left
        </Button>

        <Button variant={variant} color="error" endIcon={<Iconify icon="ic:round-access-alarm" />}>
          Icon Right
        </Button>

        <LoadingButton loading variant={variant}>
          Submit
        </LoadingButton>

        <LoadingButton loading loadingIndicator="Loading..." variant={variant}>
          Fetch data
        </LoadingButton>

        <LoadingButton
          loading
          size="large"
          loadingPosition="start"
          startIcon={<Iconify icon="ic:round-access-alarm" />}
          variant={variant}
        >
          Start
        </LoadingButton>

        <LoadingButton
          loading
          size="large"
          loadingPosition="end"
          endIcon={<Iconify icon="ic:round-access-alarm" />}
          variant={variant}
        >
          End
        </LoadingButton>
      </ComponentBlock>

      <ComponentBlock title="Sizes" spacing={1}>
        {SIZES.map((size) => (
          <Button key={size} variant={variant} color="info" size={size}>
            {size}
          </Button>
        ))}

        <Box sx={{ width: 1, height: 16 }} />

        {SIZES.map((size) => (
          <LoadingButton
            key={size}
            loading
            size={size}
            loadingPosition="start"
            startIcon={<Iconify icon="ic:round-access-alarm" />}
            variant={variant}
          >
            {size}
          </LoadingButton>
        ))}

        <Box sx={{ width: 1, height: 16 }} />

        {SIZES.map((size) => (
          <LoadingButton
            key={size}
            loading
            size={size}
            loadingPosition="end"
            endIcon={<Iconify icon="ic:round-access-alarm" />}
            variant={variant}
          >
            {size}
          </LoadingButton>
        ))}
      </ComponentBlock>
    </Masonry>
  );
}
