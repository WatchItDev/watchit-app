/**
 * Generates a cryptographically secure random number between 0 (inclusive)
 * and 1 (exclusive) using the Web Crypto API.
 *
 * This function utilizes `window.crypto.getRandomValues` to produce a random
 * value, ensuring high-quality randomness suitable for security-sensitive
 * operations. The result is normalized to fit within the [0, 1) range.
 *
 * @returns {number} A random floating-point number in the range [0, 1).
 */
export const getRandomNumber = (): number => {
  const array = new Uint32Array(1)
  window.crypto.getRandomValues(array)
  return array[0] / (0xFFFFFFFF + 1)
}
