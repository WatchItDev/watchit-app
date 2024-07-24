// @mui
import { enUS, frFR, zhCN, viVN, arSA } from '@mui/material/locale';

// PLEASE REMOVE `LOCAL STORAGE` WHEN YOU CHANGE SETTINGS.
// ----------------------------------------------------------------------

export const allLangs = [
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: 'flagpack:gb-nir',
  },
  {
    label: 'French',
    value: 'fr',
    systemValue: frFR,
    icon: 'flagpack:fr',
  },
  {
    label: 'Vietnamese',
    value: 'vi',
    systemValue: viVN,
    icon: 'flagpack:vn',
  },
  {
    label: 'Chinese',
    value: 'cn',
    systemValue: zhCN,
    icon: 'flagpack:cn',
  },
  {
    label: 'Arabic',
    value: 'ar',
    systemValue: arSA,
    icon: 'flagpack:sa',
  },
];

export const defaultLang = allLangs[0]; // English

// GET MORE COUNTRY FLAGS
// https://icon-sets.iconify.design/flagpack/
// https://www.dropbox.com/sh/nec1vwswr9lqbh9/AAB9ufC8iccxvtWi3rzZvndLa?dl=0
