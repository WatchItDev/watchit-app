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
 * Trims additional content from a publication string based on specific special characters.
 *
 * This function searches the input string for specific special characters
 * (e.g., ".—", "?—"). If one of these characters is found, the function
 * returns the portion of the string that appears before the special character,
 * appending a period (".") at the end. If none of the special characters are
 * found, the original string is returned unchanged.
 *
 * @param {string} text - The input string to be trimmed or returned as-is.
 * @returns {string} - The trimmed string if a special character is found; otherwise, the original string.
 */
export const trimPublicationContentExtraText = (text: string): string => {
  // Define the special characters to look for
  const specialChars = ['.—', '?—'];

  // Iterate over each special character
  for (const specialChar of specialChars) {
    // Find the index of the special character in the input string
    const index = text.indexOf(specialChar);

    // If the special character is found
    if (index !== -1) {
      // Return the text before the special character and add a period at the end
      return `${text.substring(0, index)}.`
    }
  }

  // If none of the special characters are found, return the original text
  return text;
};
