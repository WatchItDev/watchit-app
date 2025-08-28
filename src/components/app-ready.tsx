import { useEffect } from 'react';

export default function AppReady() {
  useEffect(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        performance.mark('react:first-paint');
        performance.measure('html→entry', 'html:start', 'entry:begin');
        performance.measure('entry→react', 'entry:begin', 'react:first-paint');
        console.table(
          performance.getEntriesByType('measure').map((m) => ({
            name: m.name,
            ms: Math.round(m.duration),
          })),
        );
        window.dispatchEvent(new Event('app:ready'));
      }),
    );
  }, []);
  return null;
}
