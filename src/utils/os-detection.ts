/**
 * Function to detect the operating system being used.
 *
 * This function determines if the current environment is macOS.
 * It first verifies whether the code is being executed in a browser environment
 * by checking for the presence of `window` and `navigator`.
 * Then it evaluates the platform using `navigator.userAgentData` if available,
 * or falls back to parsing `navigator.userAgent`.
 *
 * @function
 * @returns {Object} An object containing a boolean property `isMac`.
 * If the environment is macOS, `isMac` will be `true`; otherwise, it will be `false`.
 */
export const detectOperatingSystem = () => {
  // Check if code is running in a browser environment
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isMac: false };
  }

  // @ts-expect-error No errors for this line
  if (navigator.userAgentData) {
    // @ts-expect-error No errors for this line
    return { isMac: navigator.userAgentData.platform === 'macOS' };
  }

  return { isMac: /Mac(intosh|Intel|PPC|68K)/i.test(navigator.userAgent) };
};
