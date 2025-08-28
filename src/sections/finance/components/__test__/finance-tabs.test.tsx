import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FinanceTabs } from '../finance-tabs';
import { Provider } from 'react-redux';
import { store } from '@src/redux/store';

vi.mock('@src/workers/backgroundTaskWorker?worker', () => {
  return {
    default: class {
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    },
  };
});

vi.mock(
  '@src/sections/finance/components/finance-balance-statistics.tsx',
  () => {
    return { default: () => <div>Mocked FinanceBalanceStatistics</div> };
  },
);
vi.mock(
  '@src/sections/finance/components/finance-transactions-history.tsx',
  () => {
    return { default: () => <div>Mocked FinanceTransactionsHistory</div> };
  },
);

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <FinanceTabs />
    </Provider>,
  );
};

describe('[COMPONENTS] <FinanceTabs/>', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('to match snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('should render initial tab content (Statistics)', () => {
    renderComponent();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('should switch to Transactions tab when clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('tab', { name: /Transactions/i }));
    expect(screen.getByText('Transactions')).toBeInTheDocument();
    expect(
      screen.getByText('Mocked FinanceTransactionsHistory'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Mocked FinanceBalanceStatistics'),
    ).not.toBeInTheDocument();
  });
  it('should switch back to Statistics tab when clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('tab', { name: /Transactions/i }));
    fireEvent.click(screen.getByRole('tab', { name: /Statistics/i }));
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(
      screen.getByText('Mocked FinanceBalanceStatistics'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Mocked FinanceTransactionsHistory'),
    ).not.toBeInTheDocument();
  });
});
