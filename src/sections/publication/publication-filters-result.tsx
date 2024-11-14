// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';
// components
import Iconify from '@src/components/iconify';
// types
import { IProductFilters, IProductFilterValue } from '@src/types/product';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: IProductFilters;
  onFilters: (name: string, value: IProductFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  results: number;
};

export default function PublicationFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}: Props) {
  const handleRemoveGender = (inputValue: string) => {
    const newValue = filters.gender.filter((item) => item !== inputValue);
    onFilters('gender', newValue);
  };

  const handleRemoveCategory = () => {
    onFilters('category', 'all');
  };

  const handleRemoveColor = (inputValue: string | string[]) => {
    const newValue = filters.colors.filter((item: string) => item !== inputValue);
    onFilters('colors', newValue);
  };

  const handleRemovePrice = () => {
    onFilters('priceRange', [0, 200]);
  };

  const handleRemoveRating = () => {
    onFilters('rating', '');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.gender.length && (
          <Block label="Gender:">
            {filters.gender.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveGender(item)}
              />
            ))}
          </Block>
        )}

        {filters.category !== 'all' && (
          <Block label="Category:">
            <Chip size="small" label={filters.category} onDelete={handleRemoveCategory} />
          </Block>
        )}

        {!!filters.colors.length && (
          <Block label="Colors:">
            {filters.colors.map((item) => (
              <Chip
                key={item}
                size="small"
                label={
                  <Box
                    sx={{
                      ml: -0.5,
                      width: 18,
                      height: 18,
                      bgcolor: item,
                      borderRadius: '50%',
                      border: (theme) => `solid 1px ${alpha(theme.palette.common.white, 0.24)}`,
                    }}
                  />
                }
                onDelete={() => handleRemoveColor(item)}
              />
            ))}
          </Block>
        )}

        {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 200) && (
          <Block label="Price:">
            <Chip
              size="small"
              label={`$${filters.priceRange[0]} - ${filters.priceRange[1]}`}
              onDelete={handleRemovePrice}
            />
          </Block>
        )}

        {!!filters.rating && (
          <Block label="Rating:">
            <Chip size="small" label={filters.rating} onDelete={handleRemoveRating} />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = StackProps & {
  label: string;
};

function Block({ label, children, sx, ...other }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
