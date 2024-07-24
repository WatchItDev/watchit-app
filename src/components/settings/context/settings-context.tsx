import { createContext, useContext } from 'react';
//
import { SettingsContextProps } from '../types';

// ----------------------------------------------------------------------

export const SettingsContext = createContext({} as SettingsContextProps);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);

  if (!context) throw new Error('useSettingsContext must be use inside SettingsProvider');

  return context;
};
