import { INFO, INFO_MESSAGES } from '../info';

describe('[UTILS]: Info', () => {
  describe('INFO_MESSAGES', () => {
    const containsPlaceholders = (message: string): boolean =>
      message.includes('{') && message.includes('}');

    it('should match the snapshot of all info messages', () => {
      expect(INFO_MESSAGES).toMatchSnapshot();
    });

    it('should have a message for every info type', () => {
      Object.values(INFO).forEach((infoKey) => {
        expect(INFO_MESSAGES[infoKey as INFO]).toBeDefined();
        expect(typeof INFO_MESSAGES[infoKey as INFO]).toBe('string');
        expect(INFO_MESSAGES[infoKey as INFO].length).toBeGreaterThan(0);
      });
    });

    it('should not have extra messages that do not correspond to info types', () => {
      Object.keys(INFO_MESSAGES).forEach((messageKey) => {
        expect(Object.values(INFO)).toContain(messageKey);
      });
    });

    it('should have the correct message for DEFAULT info', () => {
      expect(INFO_MESSAGES[INFO.DEFAULT]).toBe('Default info message.');
    });

    it('should contain placeholders in REGISTER_OWNERSHIP_PROGRESS message', () => {
      expect(
        containsPlaceholders(INFO_MESSAGES[INFO.REGISTER_OWNERSHIP_PROGRESS]),
      ).toBe(true);
    });

    it('should have the correct placeholder format in messages', () => {
      const messagesWithPlaceholders =
        Object.values(INFO_MESSAGES).filter(containsPlaceholders);

      messagesWithPlaceholders.forEach((message) => {
        const placeholderRegex = /{[a-zA-Z0-9]+}/g;
        const matches = message.match(placeholderRegex) || [];

        expect(matches.length).toBeGreaterThan(0);
        matches.forEach((match) => {
          expect(match.startsWith('{')).toBe(true);
          expect(match.endsWith('}')).toBe(true);
          expect(match.length).toBeGreaterThan(2);
        });
      });
    });

    it('should have consistent withdraw-related info messages', () => {
      const withdrawInfos = [
        INFO.WITHDRAW_WAITING_CONFIRMATION,
        INFO.WITHDRAW_SENDING_CONFIRMATION,
      ];

      withdrawInfos.forEach((info) => {
        expect(INFO_MESSAGES[info]).toBeDefined();
        expect(INFO_MESSAGES[info].toLowerCase()).toMatch(/withdraw/);
      });
    });

    it('should have consistent deposit-related info messages', () => {
      const depositInfos = [
        INFO.DEPOSIT_SENDING_CONFIRMATION,
        INFO.DEPOSIT_WAITING_CONFIRMATION,
      ];

      depositInfos.forEach((info) => {
        expect(INFO_MESSAGES[info]).toBeDefined();
        expect(INFO_MESSAGES[info].toLowerCase()).toMatch(/deposit/);
      });
    });

    it('should have consistent approve-related info messages', () => {
      const approveInfos = [
        INFO.APPROVE_SENDING_CONFIRMATION,
        INFO.APPROVE_WAITING_CONFIRMATION,
      ];

      approveInfos.forEach((info) => {
        expect(INFO_MESSAGES[info]).toBeDefined();
        expect(INFO_MESSAGES[info].toLowerCase()).toMatch(/approve/);
      });
    });

    it('should have consistent confirmation pattern in waiting messages', () => {
      const waitingInfos = [
        INFO.WITHDRAW_WAITING_CONFIRMATION,
        INFO.DEPOSIT_WAITING_CONFIRMATION,
        INFO.APPROVE_WAITING_CONFIRMATION,
      ];

      waitingInfos.forEach((info) => {
        expect(INFO_MESSAGES[info]).toBeDefined();
        expect(INFO_MESSAGES[info].toLowerCase()).toMatch(
          /waiting for confirmation/,
        );
      });
    });

    it('should have consistent confirmation pattern in sending messages', () => {
      const sendingInfos = [
        INFO.WITHDRAW_SENDING_CONFIRMATION,
        INFO.DEPOSIT_SENDING_CONFIRMATION,
        INFO.APPROVE_SENDING_CONFIRMATION,
      ];

      sendingInfos.forEach((info) => {
        expect(INFO_MESSAGES[info]).toBeDefined();
        expect(INFO_MESSAGES[info].toLowerCase()).toMatch(
          /sending.*to the network/,
        );
      });
    });
  });
});
