import { describe, it, expect } from 'vitest';
import { paramCase, snakeCase } from '../change-case';

describe('[UTILS]: paramCase', () => {
  it('converts spaces to hyphens', () => {
    expect(paramCase('hello world')).toBe('hello-world');
  });

  it('converts multiple spaces to single hyphen', () => {
    expect(paramCase('hello   world')).toBe('hello-world');
  });

  it('converts to lowercase', () => {
    expect(paramCase('Hello World')).toBe('hello-world');
  });

  it('removes non-alphanumeric characters', () => {
    expect(paramCase('hello!@#$%^&*()world')).toBe('helloworld');
  });

  it('preserves hyphens', () => {
    expect(paramCase('hello-world')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(paramCase('')).toBe('');
  });

  it('handles string with only non-alphanumeric characters', () => {
    expect(paramCase('!@#$%^&*()')).toBe('');
  });

  it('matches snapshot for various inputs', () => {
    const results = [
      paramCase('Hello World'),
      paramCase('This Is A Test'),
      paramCase('special@characters!here'),
      paramCase('multiple   spaces   here'),
      paramCase('mixed-with-hyphens already'),
    ];
    expect(results).toMatchSnapshot();
  });
});

describe('[UTILS]: snakeCase', () => {
  it('converts spaces to underscores', () => {
    expect(snakeCase('hello world')).toBe('hello_world');
  });

  it('converts multiple spaces to single underscore', () => {
    expect(snakeCase('hello   world')).toBe('hello_world');
  });

  it('converts to lowercase', () => {
    expect(snakeCase('Hello World')).toBe('hello_world');
  });

  it('removes non-alphanumeric characters', () => {
    expect(snakeCase('hello!@#$%^&*()world')).toBe('helloworld');
  });

  it('preserves underscores', () => {
    expect(snakeCase('hello_world')).toBe('hello_world');
  });

  it('handles empty string', () => {
    expect(snakeCase('')).toBe('');
  });

  it('handles string with only non-alphanumeric characters', () => {
    expect(snakeCase('!@#$%^&*()')).toBe('');
  });

  it('matches snapshot for various inputs', () => {
    const results = [
      snakeCase('Hello World'),
      snakeCase('This Is A Test'),
      snakeCase('special@characters!here'),
      snakeCase('multiple   spaces   here'),
      snakeCase('mixed_with_underscores already'),
    ];
    expect(results).toMatchSnapshot();
  });
}); 