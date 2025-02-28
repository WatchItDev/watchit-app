import {
  capitalizeFirstLetter,
  createIndexForElement,
  pascalToUpperSnake,
  trimPublicationContentExtraText
} from "../text-transform"

describe('pascalToUpperSnake', () => {
  it('converts PascalCase to UPPER_SNAKE_CASE', () => {
    expect(pascalToUpperSnake('PascalCaseString')).toBe('PASCAL_CASE_STRING');
  });

  it('handles single word PascalCase', () => {
    expect(pascalToUpperSnake('Word')).toBe('WORD');
  });

  it('returns an empty string when input is empty', () => {
    expect(pascalToUpperSnake('')).toBe('');
  });
});

describe('trimPublicationContentExtraText', () => {
  it('removes special characters and adds a period if missing', () => {
    expect(trimPublicationContentExtraText('Hello—World')).toBe('HelloWorld.');
  });

  it('removes email addresses and trims extra spaces', () => {
    expect(trimPublicationContentExtraText('Contact me at example@example.com for more info.')).toBe('Contact me at  for more info.');
  });

  it('handles text without special characters or email', () => {
    expect(trimPublicationContentExtraText('This is a simple text')).toBe('This is a simple text.');
  });

  it('handles text with only special characters', () => {
    expect(trimPublicationContentExtraText('—')).toBe('.');
  });
});

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('returns the same string if the first letter is already capitalized', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });
});

describe('createIndexForElement', () => {
  it('generates a unique index of 16 characters', () => {
    const index = createIndexForElement();
    expect(index).toHaveLength(16);
    expect(typeof index).toBe('string');
  });

  it('generates different indices on subsequent calls', () => {
    const index1 = createIndexForElement();
    const index2 = createIndexForElement();
    expect(index1).not.toBe(index2);
  });
});
