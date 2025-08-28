import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import FinanceDepositFromStripe from '../finance-deposit-from-stripe';

const renderComponent = () => {
  return render(<FinanceDepositFromStripe />);
};

describe('[COMPONENTS] <FinanceDepositFromStripe /> ', () => {
  it('to match snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    renderComponent();
    expect(
      screen.getByText(/This feature is coming soon/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'We’re working hard to bring this feature to life. Check back soon!',
      ),
    ).toBeInTheDocument();
  });

  it('should have the correct styles', () => {
    renderComponent();
    const boxElement = screen
      .getByText(/This feature is coming soon/i)
      .closest('div');
    expect(boxElement).toHaveStyle('display: flex');
    expect(boxElement).toHaveStyle('flex-direction: column');
    expect(boxElement).toHaveStyle('align-items: center');
    expect(boxElement).toHaveStyle('gap: 8px');
    expect(boxElement).toHaveStyle('text-align: center');
    expect(boxElement).toHaveStyle('color: text.secondary');
  });

  it('should render the ComingSoonIllustration component', () => {
    renderComponent();
    const illustrationElement = screen.getByTestId('coming-soon-illustration');
    expect(illustrationElement).toBeInTheDocument();
  });
});
