import {
  setGlobalNotifier,
  notifyError,
  notifySuccess,
  notifyWarning,
  notifyInfo,
} from '../internal-notifications';
import { ERROR_MESSAGES, ERRORS } from '../errors';
import { SUCCESS_MESSAGES, SUCCESS } from '../success';
import { WARNING_MESSAGES, WARNING } from '../warnings';
import { INFO_MESSAGES, INFO } from '../info';

describe('[UTILS]: Internal Notifications', () => {
  type NotifierFunction = (message: string, options?: object) => void;
  const mockEnqueueSnackbar = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});

  beforeEach(() => {
    mockEnqueueSnackbar.mockClear();
    consoleErrorSpy.mockClear();
    setGlobalNotifier(mockEnqueueSnackbar);
  });

  afterEach(() => {
    // Use a properly typed empty function
    setGlobalNotifier(null as unknown as NotifierFunction);
  });

  describe('setGlobalNotifier', () => {
    it('should set the global notifier function', () => {
      setGlobalNotifier(mockEnqueueSnackbar);
      notifyError(ERRORS.UNKNOWN_ERROR);
      expect(mockEnqueueSnackbar).toHaveBeenCalledTimes(1);
    });
  });

  describe('notify functions', () => {
    it('should show error when global notifier is not set', () => {
      setGlobalNotifier(null as unknown as NotifierFunction);
      notifyError(ERRORS.UNKNOWN_ERROR);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'No globalEnqueueSnackbar is set. Cannot notify messages.',
      );
      expect(mockEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it('should notify error with correct message', () => {
      notifyError(ERRORS.NOT_LOGGED_IN);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        ERROR_MESSAGES[ERRORS.NOT_LOGGED_IN],
        { variant: 'error' },
      );
    });

    it('should notify success with correct message', () => {
      notifySuccess(SUCCESS.DEPOSIT_SUCCESSFULLY);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        SUCCESS_MESSAGES[SUCCESS.DEPOSIT_SUCCESSFULLY],
        { variant: 'success' },
      );
    });

    it('should notify warning with correct message', () => {
      notifyWarning(WARNING.NO_WALLET_CONNECTED);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        WARNING_MESSAGES[WARNING.NO_WALLET_CONNECTED],
        { variant: 'warning' },
      );
    });

    it('should notify info with correct message', () => {
      notifyInfo(INFO.DEFAULT);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        INFO_MESSAGES[INFO.DEFAULT],
        { variant: 'info' },
      );
    });

    it('should use fallback message when notification key is invalid', () => {
      // @ts-expect-error NotifierFunction is not a valid type for notifyError
      notifyError(
        'INVALID_KEY' as NotifierFunction,
        {},
        'Custom fallback message',
      );
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Custom fallback message',
        { variant: 'error' },
      );
    });

    it('should use default fallback for error when no message or fallback provided', () => {
      // @ts-expect-error NotifierFunction is not a valid type for notifyError
      notifyError('INVALID_KEY' as NotifierFunction);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'An unknown error has occurred.',
        { variant: 'error' },
      );
    });

    it('should use default fallback for success when no message or fallback provided', () => {
      // @ts-expect-error NotifierFunction is not a valid type for notifyError
      notifySuccess('INVALID_KEY' as NotifierFunction);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Operation successful.',
        { variant: 'success' },
      );
    });

    it('should use default fallback for warning when no message or fallback provided', () => {
      // @ts-expect-error NotifierFunction is not a valid type for notifyError
      notifyWarning('INVALID_KEY' as NotifierFunction);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Warning.', {
        variant: 'warning',
      });
    });

    it('should use default fallback for info when no message or fallback provided', () => {
      // @ts-expect-error NotifierFunction is not a valid type for notifyError
      notifyInfo('INVALID_KEY' as NotifierFunction);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Information.', {
        variant: 'info',
      });
    });
  });

  describe('template tags replacement', () => {
    it('should replace template tags in messages with provided data', () => {
      notifySuccess(SUCCESS.TRANSFER_CREATED_SUCCESSFULLY, {
        destination: 'user@example.com',
      });
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Transfer sent to user@example.com.',
        { variant: 'success' },
      );
    });

    it('should replace multiple template tags in messages', () => {
      notifySuccess(SUCCESS.FOLLOW_UNFOLLOW_SUCCESSFULLY, {
        profileName: 'John Doe',
        actionLbl: 'followed',
      });
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Successfully John Doe followed.',
        { variant: 'success' },
      );
    });

    it('should keep template tags when data is not provided', () => {
      notifyInfo(INFO.REGISTER_OWNERSHIP_PROGRESS);
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Processing asset {index} of {total}',
        { variant: 'info' },
      );
    });

    it('should keep template tags when data does not contain required keys', () => {
      notifyInfo(INFO.REGISTER_OWNERSHIP_PROGRESS, { otherKey: 'value' });
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Processing asset {index} of {total}',
        { variant: 'info' },
      );
    });
  });

  describe('options passing', () => {
    it('should pass additional options to enqueueSnackbar', () => {
      const options = {
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
      };

      notifySuccess(SUCCESS.DEPOSIT_SUCCESSFULLY, {}, undefined, options);

      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        SUCCESS_MESSAGES[SUCCESS.DEPOSIT_SUCCESSFULLY],
        { variant: 'success', ...options },
      );
    });
  });
});
