import { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';

export interface LoadingFadeProps {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  durationMs?: number; // fade (default 300 ms)
  delayMs?: number; // delay before fade starts (default 0 ms)
}

export const LoadingFade = ({
  loading,
  skeleton,
  children,
  durationMs = 300,
  delayMs = 0,
}: LoadingFadeProps) => {
  const durationSec = durationMs / 1000;
  const delaySec = delayMs / 1000;

  const skelRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number>();
  const [overlaySkeleton, setOverlaySkeleton] = useState(false);

  useLayoutEffect(() => {
    if (loading && skelRef.current && minHeight === undefined) {
      const h = skelRef.current.getBoundingClientRect().height;
      if (h) {
        setMinHeight(h);
        setOverlaySkeleton(true);
      }
    }
  }, [loading, minHeight]);

  const handleSkeletonExit = () => {
    setMinHeight(undefined);
    setOverlaySkeleton(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight }}>
      <AnimatePresence onExitComplete={handleSkeletonExit}>
        {loading && (
          <m.div
            key="skeleton"
            ref={skelRef}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationSec, delay: delaySec }}
            style={{
              position: overlaySkeleton ? 'absolute' : 'static',
              inset: overlaySkeleton ? 0 : 'unset',
              width: '100%',
              pointerEvents: 'none',
            }}
          >
            {skeleton}
          </m.div>
        )}
      </AnimatePresence>

      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: durationSec, delay: delaySec }}
        style={{ width: '100%' }}
      >
        {children}
      </m.div>
    </div>
  );
};
