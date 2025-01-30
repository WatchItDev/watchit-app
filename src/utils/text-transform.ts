/**
 * Converts a PascalCase string to UPPER_SNAKE_CASE
 * @param str - The string in PascalCase
 * @returns The string in UPPER_SNAKE_CASE
 */
export const pascalToUpperSnake = (str: string): string => {
  return str
    .replace(/([A-Z])/g, '_$1') // Inserts an underscore before each uppercase letter
    .toUpperCase() // Converts everything to uppercase
    .replace(/^_/, ''); // Removes the initial underscore if it exists
};

/**
 * A function that capitalizes the first letter of a given string.
 *
 * This function takes a string as input and returns a new string
 * with the first character converted to uppercase while keeping
 * the rest of the string unchanged.
 *
 * @param {string} string - The input string to be processed.
 * @returns {string} A new string with its first letter capitalized.
 */
export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
