import { describe, it, expect } from 'vitest';
import { SUCCESS, SUCCESS_MESSAGES } from '../success';

describe('[UTILS]: Success', () => {
  describe('SUCCESS_MESSAGES', () => {
    const containsPlaceholders = (message: string): boolean =>
      message.includes('{') && message.includes('}');

    it('should match the snapshot of all success messages', () => {
      expect(SUCCESS_MESSAGES).toMatchSnapshot();
    });

    it('should have a message for every success type', () => {
      Object.values(SUCCESS).forEach(successKey => {
        expect(SUCCESS_MESSAGES[successKey as SUCCESS]).toBeDefined();
        expect(typeof SUCCESS_MESSAGES[successKey as SUCCESS]).toBe('string');
        expect(SUCCESS_MESSAGES[successKey as SUCCESS].length).toBeGreaterThan(0);
      });
    });

    it('should not have extra messages that do not correspond to success types', () => {
      Object.keys(SUCCESS_MESSAGES).forEach(messageKey => {
        expect(Object.values(SUCCESS)).toContain(messageKey);
      });
    });

    it('should have the correct message for FALLBACK success', () => {
      expect(SUCCESS_MESSAGES[SUCCESS.FALLBACK]).toBe('Fallback.');
    });

    it('should have the correct message for DEPOSIT_SUCCESSFULLY success', () => {
      expect(SUCCESS_MESSAGES[SUCCESS.DEPOSIT_SUCCESSFULLY]).toBe('The deposit was successful.');
    });

    it('should contain placeholders in specific success messages', () => {
      expect(containsPlaceholders(SUCCESS_MESSAGES[SUCCESS.TRANSFER_CREATED_SUCCESSFULLY])).toBe(true);
      expect(containsPlaceholders(SUCCESS_MESSAGES[SUCCESS.FOLLOW_UNFOLLOW_SUCCESSFULLY])).toBe(true);
      expect(containsPlaceholders(SUCCESS_MESSAGES[SUCCESS.OWNERSHIP_REGISTERED_SUCCESSFULLY])).toBe(true);
    });

    it('should have the correct placeholder format in messages', () => {
      const messagesWithPlaceholders = Object.values(SUCCESS_MESSAGES).filter(containsPlaceholders);

      messagesWithPlaceholders.forEach(message => {
        const placeholderRegex = /{[a-zA-Z0-9]+}/g;
        const matches = message.match(placeholderRegex) || [];

        expect(matches.length).toBeGreaterThan(0);
        matches.forEach(match => {
          expect(match.startsWith('{')).toBe(true);
          expect(match.endsWith('}')).toBe(true);
          expect(match.length).toBeGreaterThan(2);
        });
      });
    });

    it('should have consistent transaction-related success messages', () => {
      const transactionSuccesses = [
        SUCCESS.DEPOSIT_SUCCESSFULLY,
        SUCCESS.WITHDRAW_SUCCESSFULLY,
      ];

      transactionSuccesses.forEach(success => {
        expect(SUCCESS_MESSAGES[success]).toBeDefined();
        expect(SUCCESS_MESSAGES[success].toLowerCase()).toMatch(/successful|was successful/);
      });
    });

    it('should have consistent profile-related success messages', () => {
      const profileSuccesses = [
        SUCCESS.PROFILE_METADATA_UPDATED,
        SUCCESS.PROFILE_CREATED_SUCCESSFULLY,
        SUCCESS.PROFILE_UPDATED_SUCCESSFULLY,
        SUCCESS.PROFILE_JOINED_SUCCESSFULLY,
      ];

      profileSuccesses.forEach(success => {
        expect(SUCCESS_MESSAGES[success]).toBeDefined();
        expect(SUCCESS_MESSAGES[success].toLowerCase()).toMatch(/profile|successfully/);
      });
    });

    it('should have consistent marketing-related success messages', () => {
      const marketingSuccesses = [
        SUCCESS.STRATEGY_STORED_SUCCESSFULLY,
        SUCCESS.CAMPAIGN_STORED_SUCCESSFULLY,
        SUCCESS.CAMPAIGN_CREATED_SUCCESSFULLY,
        SUCCESS.CAMPAIGN_CONFIGURED_SUCCESSFULLY,
        SUCCESS.CAMPAIGN_WITHDRAWN_SUCCESSFULLY,
      ];

      marketingSuccesses.forEach(success => {
        expect(SUCCESS_MESSAGES[success]).toBeDefined();
        expect(SUCCESS_MESSAGES[success].toLowerCase()).toMatch(/campaign|strategy|successfully/);
      });
    });
  });
});
