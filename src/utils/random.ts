/**
 * CustomRandom is an object implementing a linear congruential generator (LCG) for generating pseudo-random numbers.
 * It uses specific LCG parameters to calculate random values and provides methods for retrieving these values.
 *
 * Properties:
 * - seed: The initial seed used to produce random numbers. It is set to the current time in milliseconds.
 * - a: Multiplier parameter used in the LCG formula.
 * - c: Increment parameter used in the LCG formula.
 * - m: Modulus parameter used in the LCG formula (set to 2^32).
 *
 * Methods:
 * - next: Computes the next pseudo-random number in the sequence as per the LCG formula.
 *         Updates the seed value and returns a number between 0 and 1.
 * - getRandomDecimal: Generates a pseudo-random decimal between 0 and 1, rounded down to one decimal place.
 */
export const CustomRandom = {
  seed: new Date().getTime(),

  // LCG parameters
  a: 1664525,
  c: 1013904223,
  m: Math.pow(2, 32),

  next() {
    this.seed = (this.a * this.seed + this.c) % this.m;
    return this.seed / this.m;
  },

  get() {
    const randomValue = this.next();
    return Math.floor(randomValue * 10) / 10;
  }
};
