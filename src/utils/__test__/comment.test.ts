import { timeAgo } from '@src/utils/comment';

describe('[UTILS]: timeAgo', () => {
  it('displays time in seconds if less than a minute', () => {
    expect(timeAgo(new Date(Date.now() - 30 * 1000))).toBe('30s ago');
  });

  it('displays time in minutes if less than an hour', () => {
    expect(timeAgo(new Date(Date.now() - 5 * 60 * 1000))).toBe('5min ago');
  });

  it('displays time in hours if less than a day', () => {
    expect(timeAgo(new Date(Date.now() - 3 * 60 * 60 * 1000))).toBe('3h ago');
  });

  it('displays time in days if less than a month', () => {
    expect(timeAgo(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))).toBe('5d ago');
  });

  it('displays time in months if less than a year', () => {
    expect(timeAgo(new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000))).toBe('2mo ago');
  });

  it('displays time in years if more than a year', () => {
    expect(timeAgo(new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000))).toBe('2y ago');
  });

  it('matches the snapshot for various time ranges', () => {
    const now = Date.now();
    expect([
      timeAgo(new Date(now - 10 * 1000)),        // seconds
      timeAgo(new Date(now - 2 * 60 * 1000)),    // minutes
      timeAgo(new Date(now - 4 * 3600 * 1000)),  // hours
      timeAgo(new Date(now - 3 * 86400 * 1000)), // days
      timeAgo(new Date(now - 2 * 2592000 * 1000)), // months
      timeAgo(new Date(now - 1.5 * 31536000 * 1000)) // years
    ]).toMatchSnapshot();
  });
});
