import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import FinanceBoxRow from '../finance-box-row';

const renderComponent = () => {
  return render(
    <FinanceBoxRow>
      <div>Child 1</div>
      <div>Child 2</div>
    </FinanceBoxRow>,
  );
};
describe('[COMPONENTS] <FinanceBoxRow />', () => {
  it('renders correctly with children and matches snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it('renders children correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('Child 1')).toBeInTheDocument();
    expect(getByText('Child 2')).toBeInTheDocument();
  });

  it('has correct styles', () => {
    const { container } = renderComponent();
    const boxElement = container.querySelector('div');
    expect(boxElement).toHaveStyle('display: flex');
    expect(boxElement).toHaveStyle('align-items: center');
    expect(boxElement).toHaveStyle('justify-content: space-between');
    expect(boxElement).toHaveStyle('margin-top: 4px');
    expect(boxElement).toHaveStyle('margin-bottom: 4px');
  });
});
