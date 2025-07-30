import { useEffect } from 'react';

export default function AppReady() {
  useEffect(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('app:ready'));
      })
    );
  }, []);
  return null;
}
