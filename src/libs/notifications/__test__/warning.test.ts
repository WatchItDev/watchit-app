import { WARNING, WARNING_MESSAGES } from '../warnings';

describe('[UTILS]: Warnings', () => {
  describe('WARNING_MESSAGES', () => {
    const containsPlaceholders = (message: string): boolean =>
      message.includes('{') && message.includes('}');

    it('should match the snapshot of all warning messages', () => {
      expect(WARNING_MESSAGES).toMatchSnapshot();
    });

    it('should have a message for every warning type', () => {
      Object.values(WARNING).forEach((warningKey) => {
        expect(WARNING_MESSAGES[warningKey as WARNING]).toBeDefined();
        expect(typeof WARNING_MESSAGES[warningKey as WARNING]).toBe('string');
        expect(WARNING_MESSAGES[warningKey as WARNING].length).toBeGreaterThan(
          0,
        );
      });
    });

    it('should not have extra messages that do not correspond to warning types', () => {
      Object.keys(WARNING_MESSAGES).forEach((messageKey) => {
        expect(Object.values(WARNING)).toContain(messageKey);
      });
    });

    it('should have the correct message for NO_WALLET_AUTHORIZATION warning', () => {
      expect(WARNING_MESSAGES[WARNING.NO_WALLET_AUTHORIZATION]).toBe(
        'No wallet authorization received.',
      );
    });

    it('should have the correct message for BUNDLER_UNAVAILABLE warning', () => {
      expect(WARNING_MESSAGES[WARNING.BUNDLER_UNAVAILABLE]).toBe(
        'Session expired. Please login again.',
      );
    });

    it('should not contain placeholders in any warning messages', () => {
      Object.values(WARNING_MESSAGES).forEach((message) => {
        expect(containsPlaceholders(message)).toBe(false);
      });
    });

    it('should have consistent wallet-related warning messages', () => {
      const walletWarnings = [
        WARNING.NO_WALLET_AUTHORIZATION,
        WARNING.NO_WALLET_CONNECTED,
        WARNING.INVALID_WALLET_ADDRESS,
      ];

      walletWarnings.forEach((warning) => {
        expect(WARNING_MESSAGES[warning]).toBeDefined();
        expect(WARNING_MESSAGES[warning].toLowerCase()).toMatch(
          /wallet|address/,
        );
      });
    });

    it('should have consistent amount-related warning messages', () => {
      const amountWarnings = [
        WARNING.INVALID_DEPOSIT_AMOUNT,
        WARNING.INVALID_WITHDRAW_AMOUNT,
      ];

      amountWarnings.forEach((warning) => {
        expect(WARNING_MESSAGES[warning]).toBeDefined();
        expect(WARNING_MESSAGES[warning].toLowerCase()).toMatch(/amount/);
      });
    });
  });
});
