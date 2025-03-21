import { fDate, fDateTime, fTimestamp, fToNow } from '../format-time';

describe('[UTILS]: format-time', () => {
  // A fixed date for consistent testing
  const testDate = new Date('2023-05-15T14:30:45');
  const testDateString = '2023-05-15T14:30:45';
  const testTimestamp = testDate.getTime();

  describe('fDate', () => {
    it('formats date with default format', () => {
      expect(fDate(testDate)).toBe('15 May 2023');
      expect(fDate(testDateString)).toBe('15 May 2023');
      expect(fDate(testTimestamp)).toBe('15 May 2023');
    });

    it('formats date with custom format', () => {
      expect(fDate(testDate, 'yyyy/MM/dd')).toBe('2023/05/15');
      expect(fDate(testDateString, 'MMMM dd, yyyy')).toBe('May 15, 2023');
    });

    it('returns empty string for null or undefined', () => {
      expect(fDate(null)).toBe('');
      expect(fDate(undefined)).toBe('');
    });

    it('matches snapshot for various inputs', () => {
      const results = [
        fDate(testDate),
        fDate(testDateString, 'yyyy-MM-dd'),
        fDate(testTimestamp, 'MMMM d'),
        fDate(null)
      ];
      expect(results).toMatchSnapshot();
    });
  });

  describe('fDateTime', () => {
    it('formats date and time with default format', () => {
      const result = fDateTime(testDate);
      // Check that it contains date and time components
      expect(result).toContain('May 2023');
      expect(result).toContain('15');
    });

    it('formats date and time with custom format', () => {
      expect(fDateTime(testDate, 'yyyy/MM/dd HH:mm')).toBe('2023/05/15 14:30');
    });

    it('returns empty string for null or undefined', () => {
      expect(fDateTime(null)).toBe('');
      expect(fDateTime(undefined)).toBe('');
    });

    it('matches snapshot for various inputs', () => {
      const results = [
        fDateTime(testDate),
        fDateTime(testDateString, 'yyyy-MM-dd HH:mm:ss'),
        fDateTime(testTimestamp, 'MMMM d, h:mm a'),
        fDateTime(null)
      ];
      expect(results).toMatchSnapshot();
    });
  });

  describe('fTimestamp', () => {
    it('converts date to timestamp', () => {
      expect(fTimestamp(testDate)).toBe(testTimestamp);
      expect(fTimestamp(testDateString)).toBe(testTimestamp);
    });

    it('returns empty string for null or undefined', () => {
      expect(fTimestamp(null)).toBe('');
      expect(fTimestamp(undefined)).toBe('');
    });

    it('matches snapshot for various inputs', () => {
      const results = [
        fTimestamp(testDate),
        fTimestamp(testDateString),
        fTimestamp(testTimestamp),
        fTimestamp(null)
      ];
      expect(results).toMatchSnapshot();
    });
  });

  describe('fToNow', () => {
    it('formats relative time to now', () => {
      // Create a recent date for testing
      const justNow = new Date();
      justNow.setSeconds(justNow.getSeconds() - 30);
      
      const result = fToNow(justNow);
      expect(result).toContain('ago');
    });

    it('returns empty string for null or undefined', () => {
      expect(fToNow(null)).toBe('');
      expect(fToNow(undefined)).toBe('');
    });

    it('handles past dates', () => {
      // One year ago
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const result = fToNow(oneYearAgo);
      expect(result).toContain('year');
      expect(result).toContain('ago');
    });

    it('matches snapshot for test date', () => {
      // Note: This test may be fragile since the relative time changes
      // as time passes. Use a fixed date far in the past for stability.
      const pastDate = new Date('2000-01-01');
      expect(fToNow(pastDate)).toMatchSnapshot();
    });
  });
}); 