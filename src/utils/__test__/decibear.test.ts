import { dicebear } from '@src/utils/dicebear';

describe('[UTILS]: dicebear', () => {
  it('returns a URL with the provided seed', () => {
    expect(dicebear('test123')).toBe(
      'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=test123',
    );
  });

  it('works with empty string seed', () => {
    expect(dicebear('')).toBe(
      'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=',
    );
  });

  it('works with special characters in seed', () => {
    expect(dicebear('test@123!')).toBe(
      'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=test@123!',
    );
  });

  it('works with spaces in seed', () => {
    expect(dicebear('hello world')).toBe(
      'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=hello world',
    );
  });

  it('matches the snapshot for various seeds', () => {
    expect([
      dicebear('user1'),
      dicebear('user2'),
      dicebear('admin'),
      dicebear('123456'),
    ]).toMatchSnapshot();
  });
});
