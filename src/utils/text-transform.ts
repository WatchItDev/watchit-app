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
