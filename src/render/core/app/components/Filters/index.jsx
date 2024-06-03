import React from 'react';
import { Box, MenuItem, Button, Select, InputLabel, FormControl } from '@mui/material';

const years = [
  { label: "Before 1900", value: "Before 1900" },
  { label: "1900s", value: "1900s" },
  { label: "1910s", value: "1910s" },
  { label: "1920s", value: "1920s" },
  { label: "1930s", value: "1930s" },
  { label: "1940s", value: "1940s" },
  { label: "1950s", value: "1950s" },
  { label: "1960s", value: "1960s" },
  { label: "1970s", value: "1970s" },
  { label: "1980s", value: "1980s" },
  { label: "1990s", value: "1990s" },
  { label: "2000s", value: "2000s" },
  { label: "2010s", value: "2010s" },
  { label: "2020s", value: "2020s" }
];

const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

const Filters = ({ year, genre, onYearChange, onGenreChange, onResetFilters }) => {
  return (
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormControl variant="outlined" fullWidth sx={{ minWidth: '120px', color: 'rgba(255, 255, 255, 0.7)', height: '46px' }}>
          {/*<InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Year</InputLabel>*/}
          <Select
              value={year}
              onChange={onYearChange}
              sx={{
                height: '46px',
                overflow: 'hidden',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSelect-select': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              displayEmpty
              renderValue={(selected) => {
                  if (!selected) {
                      return <em>Year</em>;
                  }

                  return selected;
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
          >
            {years.map((year) => (
                <MenuItem key={year.value} value={year.value}>
                  {year.label}
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth sx={{ minWidth: '120px', color: 'rgba(255, 255, 255, 0.7)', height: '46px' }}>
          {/*<InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Genre</InputLabel>*/}
          <Select
              value={genre}
              onChange={onGenreChange}
              sx={{
                height: '46px',
                overflow: 'hidden',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
                '& .MuiSelect-select': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              displayEmpty
              renderValue={(selected) => {
                  if (!selected) {
                      return <em>Genre</em>;
                  }

                  return selected;
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
          >
            {genres.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        {(year || genre) && (
            <Button
                variant="outlined"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderColor: 'transparent',
                  '&:hover': {
                    borderColor: 'transparent',
                  },
                }}
                onClick={onResetFilters}
            >
              Reset
            </Button>
        )}
      </Box>
  );
};

export default Filters;
