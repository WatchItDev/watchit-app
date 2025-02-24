import numeral from 'numeral'

type InputValue = string | number | null;

export function fNumber(number: InputValue) {
  return numeral(number).format()
}

export function fCurrency(number: InputValue) {
  const format = number ? numeral(number).format('$0,0.00') : ''

  return result(format, '.00')
}

export function fPercent(number: InputValue) {
  const format = number ? numeral(Number(number) / 100).format('0.0%') : ''

  return result(format, '.0')
}

export function fShortenNumber(number: InputValue) {
  const format = number ? numeral(number).format('0.00a') : ''

  return result(format, '.00')
}

export function fData(number: InputValue) {
  const format = number ? numeral(number).format('0.0 b') : ''

  return result(format, '.0')
}

function result(format: string, key = '.00') {
  const isInteger = format.includes(key)

  return isInteger ? format.replace(key, '') : format
}

export function formatBalanceNumber(balance: number) {
  const balanceOptions = { minimumFractionDigits: 1, maximumFractionDigits: 3 }
  return new Intl.NumberFormat('en-US', balanceOptions).format(balance as any)
}

interface AmountConstraintsProps {
  value: number;
  MAX_AMOUNT: number;
  MAX_POOL: number;
  setAmount: (value: number) => void;
  setCanContinue: (canContinue: boolean) => void;
}

export const handleAmountConstraints = ({
                                          value,
                                          MAX_AMOUNT,
                                          MAX_POOL,
                                          setAmount,
                                          setCanContinue,
                                        }: AmountConstraintsProps) => {
  if (value > MAX_POOL) {
    value = MAX_POOL // Truncate to a thousand millions
  }
  if (value < 0) {
    value = 0 // Set amount to 0 if lower than 0
  }
  setAmount(value)
  setCanContinue(value <= MAX_AMOUNT)

  // If amount is greater than balance, allow input but setCanContinue to false
  if (value > MAX_AMOUNT || value <= 0) {
    setCanContinue(false)
  }
  console.log('value', value)
}
