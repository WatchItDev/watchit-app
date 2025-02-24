import { useMemo } from 'react'
import merge from 'lodash/merge'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles'
import { customShadows } from './custom-shadows'
import { contrast } from './options/contrast'
import { darkMode } from './options/dark-mode'
import { presets } from './options/presets'
import RTL, { direction } from './options/right-to-left'
import { componentsOverrides } from './overrides'
import { palette } from './palette'
import { shadows } from './shadows'
import { typography } from './typography'
import { useSettingsContext } from '@src/components/settings'
import { useLocales } from '@src/locales'

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const { currentLang } = useLocales()

  const settings = useSettingsContext()

  const darkModeOption = darkMode(settings.themeMode)

  const presetsOption = presets(settings.themeColorPresets)

  const contrastOption = contrast(settings.themeContrast === 'bold', settings.themeMode)

  const directionOption = direction(settings.themeDirection)

  const baseOption = useMemo(
    () => ({
      palette: palette('light'),
      shadows: shadows('light'),
      customShadows: customShadows('light'),
      typography,
      shape: { borderRadius: 8 },
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 900,
          lg: 1200,
          xl: 1536,
          xlg: 1750,
        },
      },
    }),
    []
  )

  const memoizedValue = useMemo(
    () =>
      merge(
        // Base
        baseOption,
        // Direction: remove if not in use
        directionOption,
        // Dark mode: remove if not in use
        darkModeOption,
        // Presets: remove if not in use
        presetsOption,
        // Contrast: remove if not in use
        contrastOption.theme
      ),
    [baseOption, directionOption, darkModeOption, presetsOption, contrastOption.theme]
  )

  const theme = createTheme(memoizedValue as ThemeOptions)

  theme.components = merge(componentsOverrides(theme), contrastOption.components)

  const themeWithLocale = useMemo(
    () => createTheme(theme, currentLang.systemValue),
    [currentLang.systemValue, theme]
  )

  return (
    <MuiThemeProvider theme={themeWithLocale}>
      <RTL themeDirection={settings.themeDirection}>
        <CssBaseline />
        {children}
      </RTL>
    </MuiThemeProvider>
  )
}
