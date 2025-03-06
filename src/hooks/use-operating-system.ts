import { useState, useEffect } from 'react';

export function useOperatingSystem() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (navigator.userAgentData) {
      setIsMac(navigator.userAgentData.platform === 'macOS');
    } else {
      setIsMac(/Mac(intosh|Intel|PPC|68K)/i.test(navigator.userAgent));
    }
  }, []);

  return { isMac };
}
