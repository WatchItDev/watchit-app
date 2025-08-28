import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import FinanceEarnTokens, {
  FinanceEarnTokensProps,
} from '@src/sections/finance/components/finance-earn-tokens';

import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import ThemeProvider from '@src/theme';
import { SettingsProvider } from '@src/components/settings';

const renderComponent = (
  props: FinanceEarnTokensProps,
  Component: React.ComponentType<FinanceEarnTokensProps> = FinanceEarnTokens,
) =>
  render(
    <SettingsProvider
      defaultSettings={{
        themeMode: 'dark',
        themeDirection: 'ltr',
        themeContrast: 'default',
        themeLayout: 'vertical',
        themeColorPresets: 'default',
        themeStretch: false,
      }}
    >
      <ThemeProvider>
        <Component {...props} />
      </ThemeProvider>
    </SettingsProvider>,
  );

describe('Components: FinanceEarnTokens component testing', () => {
  const financeEarnTokensProps = {
    lgUp: true,
    sx: {},
  };

  afterEach(() => {
    cleanup();
  });

  it('to match snapshot', () => {
    const { baseElement } = renderComponent(financeEarnTokensProps);
    expect(baseElement).toMatchSnapshot();
  });

  it('displays the correct title', () => {
    const { getByText } = renderComponent(financeEarnTokensProps);
    expect(getByText(/Earn rewards effortlessly!/i)).toBeInTheDocument();
  });

  it('displays the correct subtitle', () => {
    const { getAllByText } = renderComponent(financeEarnTokensProps);
    expect(getAllByText(/earn/i)[1]).toBeInTheDocument();
    expect(getAllByText(/mmc/i)[0]).toBeInTheDocument();
    expect(getAllByText(/tokens/i)[0]).toBeInTheDocument();
  });

  it('displays the correct description', () => {
    const { getByText } = renderComponent(financeEarnTokensProps);
    expect(
      getByText(
        /Complete tasks, grow your balance, and unlock exciting rewards./i,
      ),
    ).toBeInTheDocument();
  });

  it('calls handleClick when the button is clicked', () => {
    const { getByText } = renderComponent(financeEarnTokensProps);
    const button = getByText(/Start earning now!/i);
    const windowOpenSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null);
    fireEvent.click(button);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      GLOBAL_CONSTANTS.EARN_TOKEN_SERVICE_URL,
      '_BLANK',
    );
    windowOpenSpy.mockRestore();
  });

  it('displays the image on large screens', () => {
    const { getByAltText } = renderComponent(financeEarnTokensProps);
    expect(getByAltText(/Earn MMC tokens/i)).toBeInTheDocument();
  });
});
