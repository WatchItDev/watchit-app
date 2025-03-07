import { ERRORS, ERROR_MESSAGES } from '../errors';

describe('[UTILS]: Errors', () => {
  describe('ERROR_MESSAGES', () => {
    const containsPlaceholders = (message: string): boolean =>
      message.includes('{') && message.includes('}');

    it('should have a message for every error type', () => {
      Object.values(ERRORS).forEach(errorKey => {
        expect(ERROR_MESSAGES[errorKey as ERRORS]).toBeDefined();
        expect(typeof ERROR_MESSAGES[errorKey as ERRORS]).toBe('string');
        expect(ERROR_MESSAGES[errorKey as ERRORS].length).toBeGreaterThan(0);
      });
    });

    it('should not have extra messages that do not correspond to error types', () => {
      Object.keys(ERROR_MESSAGES).forEach(messageKey => {
        expect(Object.values(ERRORS)).toContain(messageKey);
      });
    });

    it('should have the correct message for NOT_LOGGED_IN error', () => {
      expect(ERROR_MESSAGES[ERRORS.NOT_LOGGED_IN]).toBe('Please log in to continue.');
    });

    it('should have the correct message for UNKNOWN_ERROR error', () => {
      expect(ERROR_MESSAGES[ERRORS.UNKNOWN_ERROR]).toBe('An unknown error has occurred.');
    });

    it('should contain placeholders in specific error messages', () => {
      expect(containsPlaceholders(ERROR_MESSAGES[ERRORS.INSUFFICIENT_ALLOWANCE_ERROR])).toBe(true);
      expect(containsPlaceholders(ERROR_MESSAGES[ERRORS.INSUFFICIENT_FUNDS_ERROR])).toBe(true);
      expect(containsPlaceholders(ERROR_MESSAGES[ERRORS.SUBSCRIBE_MINIMUN_DAYS_ERROR])).toBe(true);
      expect(containsPlaceholders(ERROR_MESSAGES[ERRORS.ASSET_OWNERSHIP_REGISTER_ERROR])).toBe(true);
    });

    it('should have the correct placeholder format in messages', () => {
      const messagesWithPlaceholders = Object.values(ERROR_MESSAGES).filter(containsPlaceholders);

      messagesWithPlaceholders.forEach(message => {
        // Check that placeholders are in the format {placeholder}
        const placeholderRegex = /{[a-zA-Z0-9]+}/g;
        const matches = message.match(placeholderRegex) || [];

        expect(matches.length).toBeGreaterThan(0);
        matches.forEach(match => {
          expect(match.startsWith('{')).toBe(true);
          expect(match.endsWith('}')).toBe(true);
          expect(match.length).toBeGreaterThan(2); // More than just '{}'
        });
      });
    });

    it('should have consistent login-related error messages', () => {
      const loginErrors = [
        ERRORS.LOGIN_FAILED_ERROR,
        ERRORS.FIRST_LOGIN_ERROR,
        ERRORS.NOT_LOGGED_IN,
      ];

      loginErrors.forEach(error => {
        expect(ERROR_MESSAGES[error]).toBeDefined();
        expect(ERROR_MESSAGES[error].toLowerCase()).toMatch(/login|log in/);
      });
    });

    it('should have consistent wallet-related error messages', () => {
      const walletErrors = [
        ERRORS.METAMASK_CONNECTING_ERROR,
        ERRORS.METAMASK_CONNECTING_FAILED_ERROR,
        ERRORS.METAMASK_CHANGE_WALLET_ERROR,
        ERRORS.FAILED_CHANGE_WALLET_ERROR,
        ERRORS.WALLET_CONNECTION_ERROR,
      ];

      walletErrors.forEach(error => {
        expect(ERROR_MESSAGES[error]).toBeDefined();
        expect(ERROR_MESSAGES[error].toLowerCase()).toMatch(/wallet|metamask|connect/);
      });
    });
  });
});
