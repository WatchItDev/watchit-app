import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('@web3auth/auth', () => ({
  keccak256Padded: vi.fn(),
  mimcGetConstants: vi.fn(),
}));

vi.mock('ethereum-cryptography/utils.js', () => ({
  keccak256: vi.fn(() => new Uint8Array()),
}));

vi.mock('@src/sections/finance/components/finance-widget-summary', () => ({
  default: ({ percent }: { percent: number }) =>
    percent > 0 ? <div>Mocked FinanceWidgetSummary</div> : null,
}));

vi.mock('@src/sections/finance/components/finance-quick-transfer', () => ({
  default: () => <div>Mocked FinanceQuickTransfer</div>,
}));
vi.mock('@src/sections/finance/components/finance-earn-tokens', () => ({
  default: () => <div>Mocked FinanceEarnTokens</div>,
}));

vi.mock('@src/hooks/use-responsive.ts', () => ({
  useResponsive: vi.fn(() => true),
}));
const useResponsiveMock = vi.fn();
vi.mock('@src/hooks/use-responsive.ts', () => ({
  useResponsive: (...args: any[]) => useResponsiveMock(...args),
}));

import { SummaryAndActions } from '../finance-summary-and-actions';

const mockProps = {
  percent: 0,
  widgetSeriesData: [],
  balanceFromRedux: 0,
  following: undefined,
  loadingProfiles: false,
};

const renderComponent = (props = mockProps) =>
  render(<SummaryAndActions {...props} />);

describe('[COMPONENTS] <FinanceSummaryAndActions/>', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useResponsiveMock.mockImplementation((_, bp) =>
      bp === 'lg' ? true : false,
    );
  });
  it('should match snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('should render FinanceWidgetSummary and FinanceQuickTransfer components', () => {
    useResponsiveMock.mockImplementation((_, bp) =>
      bp === 'md' ? false : true,
    );
    const { getByText } = renderComponent({ ...mockProps, percent: 50 });
    expect(getByText('Mocked FinanceWidgetSummary')).toBeInTheDocument();
    expect(getByText('Mocked FinanceQuickTransfer')).toBeInTheDocument();
  });

  it('should not render FinanceQuickTransfer when mdUp is true', () => {
    useResponsiveMock.mockImplementation((_, bp) =>
      bp === 'md' ? true : false,
    );
    const { queryByText } = renderComponent();
    expect(queryByText('Mocked FinanceQuickTransfer')).toBeNull();
  });
  it('should render FinanceEarnTokens only when lgUp is true', () => {
    useResponsiveMock.mockImplementation((_, bp) =>
      bp === 'lg' ? true : false,
    );
    const { getByText } = renderComponent();
    expect(getByText('Mocked FinanceEarnTokens')).toBeInTheDocument();
  });

  it('should not render FinanceEarnTokens when lgUp is false', () => {
    useResponsiveMock.mockImplementation((_, bp) =>
      bp === 'lg' ? false : true,
    );
    const { queryByText } = renderComponent();
    expect(queryByText('Mocked FinanceEarnTokens')).toBeNull();
  });

  it('should not render FinanceWidgetSummary when percent is 0', () => {
    const { queryByText } = renderComponent({ ...mockProps, percent: 0 });
    expect(queryByText('Mocked FinanceWidgetSummary')).toBeNull();
  });
});
