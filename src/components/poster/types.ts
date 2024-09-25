// @mui
import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface Poster {
  id: string
  title: string
  synopsis: string
  images: {
    vertical: string
    horizontal: string
    wallpaper: string
  }
  rating?: number
  year: number
  likes: number
  price?: {
    wvc?: number
    usd?: number
  }
  genre: string[]
  trailerUrl?: string
  sx?: SxProps<Theme>
}
