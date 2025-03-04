import { fNumber, fCurrency, fPercent, fShortenNumber, fData, formatBalanceNumber, handleAmountConstraints } from '@src/utils/format-number';

describe('[UTILS]: fNumber', () => {
  it('formats a regular number correctly', () => {
    expect(fNumber(1234)).toBe('1,234');
  });

  it('handles string numeric input', () => {
    expect(fNumber('5678')).toBe('5,678');
  });

  it('handles decimal numbers', () => {
    expect(fNumber(1234.56)).toBe('1,235');
  });

  it('handles negative numbers', () => {
    expect(fNumber(-1234)).toBe('-1,234');
  });

  it('handles null value', () => {
    expect(fNumber(null)).toBe('0');
  });

  it('handles zero', () => {
    expect(fNumber(0)).toBe('0');
  });

  it('matches snapshot for different inputs', () => {
    const results = [
      fNumber(1000),
      fNumber('2500'),
      fNumber(-350),
      fNumber(0),
      fNumber(null)
    ];
    expect(results).toMatchSnapshot();
  });
});

describe('[UTILS]: fCurrency', () => {
  it('formats currency for whole numbers', () => {
    expect(fCurrency(1000)).toBe('$1,000');
  });

  it('formats currency with decimal places', () => {
    expect(fCurrency(1000.5)).toBe('$1,000.50');
  });

  it('handles string numeric input', () => {
    expect(fCurrency('1000')).toBe('$1,000');
  });

  it('handles exact decimal values that should not show zeros', () => {
    expect(fCurrency(1000.00)).toBe('$1,000');
  });

  it('handles negative amounts', () => {
    expect(fCurrency(-500.75)).toBe('-$500.75');
  });

  it('handles null value', () => {
    expect(fCurrency(null)).toBe('');
  });

  it('handles zero value', () => {
    expect(fCurrency(0)).toBe('');
  });
});

describe('[UTILS]: fPercent', () => {
  it('formats percentage for whole numbers', () => {
    expect(fPercent(50)).toBe('50%');
  });

  it('formats percentage for decimal numbers', () => {
    expect(fPercent(25.5)).toBe('25.5%');
  });

  it('handles string numeric input', () => {
    expect(fPercent('75')).toBe('75%');
  });

  it('handles exact decimal values that should not show zeros', () => {
    expect(fPercent(100)).toBe('100%');
  });

  it('handles negative percentages', () => {
    expect(fPercent(-20)).toBe('-20%');
  });

  it('handles null value', () => {
    expect(fPercent(null)).toBe('');
  });

  it('handles zero value', () => {
    expect(fPercent(0)).toBe('');
  });
});

describe('[UTILS]: fShortenNumber', () => {
  it('shortens thousands', () => {
    expect(fShortenNumber(5000)).toBe('5k');
  });

  it('shortens millions', () => {
    expect(fShortenNumber(3500000)).toBe('3.50m');
  });

  it('shortens billions', () => {
    expect(fShortenNumber(1200000000)).toBe('1.20b');
  });

  it('handles decimal numbers', () => {
    expect(fShortenNumber(1234.56)).toBe('1.23k');
  });

  it('handles string numeric input', () => {
    expect(fShortenNumber('7500000')).toBe('7.50m');
  });

  it('handles null value', () => {
    expect(fShortenNumber(null)).toBe('');
  });

  it('handles zero value', () => {
    expect(fShortenNumber(0)).toBe('');
  });
});

describe('[UTILS]: fData', () => {
  it('formats bytes', () => {
    expect(fData(900)).toBe('900 B');
  });

  it('formats kilobytes', () => {
    expect(fData(1500)).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(fData(2500000)).toBe('2.5 MB');
  });

  it('formats gigabytes', () => {
    expect(fData(3500000000)).toBe('3.5 GB');
  });

  it('handles string numeric input', () => {
    expect(fData('1048576')).toBe('1 MB');
  });

  it('handles null value', () => {
    expect(fData(null)).toBe('');
  });

  it('handles zero value', () => {
    expect(fData(0)).toBe('');
  });
});

describe('[UTILS]: formatBalanceNumber', () => {
  it('formats whole number with minimum one decimal place', () => {
    expect(formatBalanceNumber(100)).toBe('100.0');
  });

  it('formats decimal number with up to three decimal places', () => {
    expect(formatBalanceNumber(100.12345)).toBe('100.123');
  });

  it('formats decimal number with exactly three decimal places', () => {
    expect(formatBalanceNumber(100.123)).toBe('100.123');
  });

  it('formats decimal number with one decimal place', () => {
    expect(formatBalanceNumber(100.5)).toBe('100.5');
  });

  it('adds thousand separators for large numbers', () => {
    expect(formatBalanceNumber(1234567.89)).toBe('1,234,567.89');
  });

  it('handles zero', () => {
    expect(formatBalanceNumber(0)).toBe('0.0');
  });

  it('handles negative numbers', () => {
    expect(formatBalanceNumber(-123.456)).toBe('-123.456');
  });
});

describe('[UTILS]: handleAmountConstraints', () => {
  it('handles amount within valid range', () => {
    const setAmount = vi.fn();
    const setCanContinue = vi.fn();

    handleAmountConstraints({
      value: 500,
      MAX_AMOUNT: 1000,
      MAX_POOL: 2000,
      setAmount,
      setCanContinue
    });

    expect(setAmount).toHaveBeenCalledWith(500);
    expect(setCanContinue).toHaveBeenCalledWith(true);
  });

  it('truncates amount that exceeds MAX_POOL', () => {
    const setAmount = vi.fn();
    const setCanContinue = vi.fn();

    handleAmountConstraints({
      value: 3000,
      MAX_AMOUNT: 1000,
      MAX_POOL: 2000,
      setAmount,
      setCanContinue
    });

    expect(setAmount).toHaveBeenCalledWith(2000);
    expect(setCanContinue).toHaveBeenCalledWith(false);
  });

  it('sets zero for negative values', () => {
    const setAmount = vi.fn();
    const setCanContinue = vi.fn();

    handleAmountConstraints({
      value: -100,
      MAX_AMOUNT: 1000,
      MAX_POOL: 2000,
      setAmount,
      setCanContinue
    });

    expect(setAmount).toHaveBeenCalledWith(0);
    expect(setCanContinue).toHaveBeenCalledWith(false);
  });

  it('sets canContinue to false when amount exceeds MAX_AMOUNT', () => {
    const setAmount = vi.fn();
    const setCanContinue = vi.fn();

    handleAmountConstraints({
      value: 1500,
      MAX_AMOUNT: 1000,
      MAX_POOL: 2000,
      setAmount,
      setCanContinue
    });

    expect(setAmount).toHaveBeenCalledWith(1500);
    expect(setCanContinue).toHaveBeenCalledWith(false);
  });

  it('sets canContinue to false when amount is zero', () => {
    const setAmount = vi.fn();
    const setCanContinue = vi.fn();

    handleAmountConstraints({
      value: 0,
      MAX_AMOUNT: 1000,
      MAX_POOL: 2000,
      setAmount,
      setCanContinue
    });

    expect(setAmount).toHaveBeenCalledWith(0);
    expect(setCanContinue).toHaveBeenCalledWith(false);
  });
});
