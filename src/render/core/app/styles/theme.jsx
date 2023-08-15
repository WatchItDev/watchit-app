import {
  THEME_BACKGROUND_DEFAULT,
  THEME_BACKGROUND_PAPER,
  THEME_COLOR_PRIMARY_LIGHT,
  THEME_COLOR_PRIMARY_MAIN,
  THEME_COLOR_PRIMARY_DARK,
  THEME_COLOR_SECONDARY_LIGHT,
  THEME_COLOR_SECONDARY_MAIN,
  THEME_COLOR_SECONDARY_DARK,
  THEME_COLOR_SUCCESS_LIGHT,
  THEME_COLOR_SUCCESS_MAIN,
  THEME_COLOR_SUCCESS_DARK,
  THEME_COLOR_WARNING_LIGHT,
  THEME_COLOR_WARNING_MAIN,
  THEME_COLOR_WARNING_DARK,
  THEME_COLOR_ERROR_LIGHT,
  THEME_COLOR_ERROR_MAIN,
  THEME_COLOR_ERROR_DARK,
  THEME_COLOR_GREY_50,
  THEME_COLOR_GREY_100,
  THEME_COLOR_GREY_200,
  THEME_COLOR_GREY_300,
  THEME_COLOR_GREY_500,
  THEME_COLOR_GREY_600,
  THEME_COLOR_GREY_700,
  THEME_COLOR_GREY_900,
  THEME_DARK_BACKGROUND_DEFAULT,
  THEME_DARK_BACKGROUND_PAPER,
  THEME_DARK_COLOR_PRIMARY_LIGHT,
  THEME_DARK_COLOR_PRIMARY_MAIN,
  THEME_DARK_COLOR_PRIMARY_DARK,
  THEME_DARK_COLOR_SECONDARY_LIGHT,
  THEME_DARK_COLOR_SECONDARY_MAIN,
  THEME_DARK_COLOR_SECONDARY_DARK,
  THEME_DARK_COLOR_SUCCESS_LIGHT,
  THEME_DARK_COLOR_SUCCESS_MAIN,
  THEME_DARK_COLOR_SUCCESS_DARK,
  THEME_DARK_COLOR_WARNING_LIGHT,
  THEME_DARK_COLOR_WARNING_MAIN,
  THEME_DARK_COLOR_WARNING_DARK,
  THEME_DARK_COLOR_ERROR_LIGHT,
  THEME_DARK_COLOR_ERROR_MAIN,
  THEME_DARK_COLOR_ERROR_DARK,
  THEME_DARK_COLOR_GREY_50,
  THEME_DARK_COLOR_GREY_100,
  THEME_DARK_COLOR_GREY_200,
  THEME_DARK_COLOR_GREY_300,
  THEME_DARK_COLOR_GREY_500,
  THEME_DARK_COLOR_GREY_600,
  THEME_DARK_COLOR_GREY_700,
  THEME_DARK_COLOR_GREY_900,
  THEME_SHAPE_BORDER_RADIUS
} from './CONSTANTS'
import React from 'react'
import { ComponentsOverrides, PaletteMode } from '@mui/material'

export const typography = (mode) => ({
    typography: {
      fontFamily: '\'Roboto\', sans-serif',
      h6: {
        fontWeight: 500,
        fontSize: '2rem',
        color: 'red'
      },
      h5: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: Object.is(mode, 'light') ? THEME_COLOR_GREY_300 : THEME_DARK_COLOR_GREY_900
      },
      h4: {
        fontSize: '1.1rem',
        fontWeight: 600,
        color: Object.is(mode, 'light') ? THEME_COLOR_GREY_300 : THEME_DARK_COLOR_GREY_900
      },
      h3: {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: Object.is(mode, 'light') ? THEME_COLOR_GREY_300 : THEME_DARK_COLOR_GREY_900
      },
      h2: {
        fontWeight: 'bold',
        fontSize: '20px',
        color: Object.is(mode, 'light') ? THEME_COLOR_PRIMARY_LIGHT : THEME_DARK_COLOR_GREY_700
      },
      h1: {
        fontWeight: 'bold',
        fontSize: '40px',
        color: Object.is(mode, 'light') ? THEME_COLOR_PRIMARY_LIGHT : THEME_DARK_COLOR_GREY_700
      },
      subtitle1: {
        fontWeight: 'regular',
        fontSize: '20px',
        color: Object.is(mode, 'light') ? THEME_COLOR_PRIMARY_LIGHT : THEME_DARK_COLOR_GREY_700
      },
      subtitle2: {
        fontWeight: 'regular',
        fontSize: '16px',
        color: Object.is(mode, 'light') ? THEME_COLOR_PRIMARY_LIGHT : THEME_DARK_COLOR_GREY_700
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        color: Object.is(mode, 'light') ? THEME_COLOR_GREY_500 : THEME_DARK_COLOR_GREY_500
      },
      body1: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: '1.334em'
      },
      body2: {
        letterSpacing: '0em',
        fontWeight: 400,
        lineHeight: '1.5em',
        color: Object.is(mode, 'light') ? THEME_COLOR_GREY_700 : THEME_DARK_COLOR_GREY_700
      }, 
    },
  })

  export const defaultTheme = Object.assign({}, typography('light'),
  {
    palette: {
      mode: 'light',
      primary: {
        light: THEME_COLOR_PRIMARY_LIGHT,
        main: THEME_COLOR_PRIMARY_MAIN,
        dark: THEME_COLOR_PRIMARY_DARK
      },
      secondary: {
        light: THEME_COLOR_SECONDARY_LIGHT,
        main: THEME_COLOR_SECONDARY_MAIN,
        dark: THEME_COLOR_SECONDARY_DARK
      },
      warning: {
        light: THEME_COLOR_WARNING_LIGHT,
        main: THEME_COLOR_WARNING_MAIN,
        dark: THEME_COLOR_WARNING_DARK
      },
      success: {
        light: THEME_COLOR_SUCCESS_LIGHT,
        main: THEME_COLOR_SUCCESS_MAIN,
        dark: THEME_COLOR_SUCCESS_DARK
      },
      error: {
        light: THEME_COLOR_ERROR_LIGHT,
        main: THEME_COLOR_ERROR_MAIN,
        dark: THEME_COLOR_ERROR_DARK
      },
      grey: {
        50: THEME_COLOR_GREY_50,
        100: THEME_COLOR_GREY_100,
        200: THEME_COLOR_GREY_200,
        300: THEME_COLOR_GREY_300,
        500: THEME_COLOR_GREY_500,
        600: THEME_COLOR_GREY_600,
        700: THEME_COLOR_GREY_700,
        900: THEME_COLOR_GREY_900
      },
      text: {
        primary: THEME_COLOR_GREY_300,
        secondary: THEME_COLOR_GREY_200
      },
      divider: THEME_COLOR_GREY_500,
      background: {
        default: THEME_BACKGROUND_DEFAULT,
        paper: THEME_BACKGROUND_PAPER
      }
    },
    size:{
      bold: { fontWeight: 'bold !important',color:'red !important'}
    },
    shape: {
      borderRadius: THEME_SHAPE_BORDER_RADIUS
    }
  }
)