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
 * An array of strings containing various special character patterns and names.
 * The strings in this array include names or identifiers preceded by
 * special characters such as dashes, question marks, or periods.
 * Some entries also contain only special characters or brace-like structures.
 */
const specialChars = [
  '—Huggo',
  '?—Nick Riganas',
  '.—Rhino',
  '—Eric Johnson',
  '—Jwelch5742',
  '—yusufpiskin',
  '—Maths Jesperson',
  '—Mark Logan',
  '—Snow Leopard',
  '—Claudio Carvalho, Rio de Janeiro, Brazil',
  '—Johnny-the-Film-Sentinel-2187',
  '—grantss',
  '—Ed Stephan',
  '—filmfactsman',
  '—Col Needham',
  '—Tony Fontana',
  '—garykmcd',
  '—',
  '?—',
  '.—',
  '{}',
];

/**
 * A regular expression pattern used for matching and validating email addresses.
 *
 * This pattern supports common email formats, where:
 * - The local part can contain alphanumeric characters, dots, underscores,
 *   percent signs, plus signs, and hyphens.
 * - The domain part is structured as one or more labels separated by dots,
 *   with each label containing alphanumeric characters or hyphens.
 * - The top-level domain must be at least two characters long and consist
 *   only of alphabetic characters.
 *
 * Flags:
 * - The "g" flag enables global matching, allowing multiple occurrences
 *   of email addresses to be matched in a single string.
 */
const emailRegex =
  /\b[a-zA-Z0-9][a-zA-Z0-9._%+-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\b/g;

/**
 * Removes special characters from the given text string and returns the cleaned string.
 *
 * @param {string} text - The input string from which special characters will be removed.
 * @return {string} - The resulting string after special characters are removed.
 */
function removeSpecialChars(text: string): string {
  // Loop through the special characters and replace them with spaces
  for (const char of specialChars) {
    text = text.replace(char, '').trim();
  }
  return text;
}

/**
 * Detects whether the given text contains a valid email address pattern.
 *
 * @param {string} text - The string to be checked for an email address.
 * @return {boolean} Returns `true` if the text contains a valid email address, otherwise `false`.
 */
function detectEmail(text: string): boolean {
  return emailRegex.test(text);
}

/**
 * Removes an email address from the provided text string, if present.
 *
 * @param {string} text - The input string potentially containing an email address.
 * @return {string} The modified string with the email address removed and trimmed of extra spaces.
 */
function removeEmail(text: string): string {
  return text.replace(emailRegex, '').trim();
}

/**
 * Processes and trims extra content from a publication text, including special characters,
 * email addresses, and patterns at the end of the text.
 *
 * @param {string} text - The input string representing the publication content to be processed.
 * @returns {string} The processed and cleaned text after applying trimming rules.
 */
export const trimPublicationContentExtraText = (text: string): string => {
  const hasEmail = detectEmail(text);

  if (hasEmail) {
    text = removeEmail(text);
  }

  let cleanedText = removeSpecialChars(text);

  // Verify if the last character is a period, if not, add one
  if (!cleanedText.endsWith('.')) {
    cleanedText += '.';
  }

  return `${cleanedText}`;
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
  if (!string?.length) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const createIndexForElement = (): string => {
  const array = new Uint8Array(8);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
};
