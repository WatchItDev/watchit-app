import { useCallback, useEffect, useState } from 'react';
import { openLoginModal } from '@redux/auth';
import type { AppDispatch } from '@src/redux/store';
import type { ReduxSession } from '@redux/types';
import type { ReactionValue } from '@src/sections/explore/types';

interface UseReactionMenuArgs {
  session: ReduxSession | null;
  dispatch: AppDispatch;
  buttonRef: React.MutableRefObject<HTMLButtonElement | null>;
  menuRef: React.MutableRefObject<HTMLDivElement | null>;
}

interface UseReactionMenuResult {
  reaction: ReactionValue | null;
  setReaction: React.Dispatch<React.SetStateAction<ReactionValue | null>>;
  reactionMenuOpen: boolean;
  setReactionMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleReactionButtonClick: () => void;
  handleReactionChange: (value: ReactionValue) => void;
}

/**
 * Manages the reaction picker behaviour, including authentication gating.
 */
export const useReactionMenu = ({
  session,
  dispatch,
  buttonRef,
  menuRef,
}: UseReactionMenuArgs): UseReactionMenuResult => {
  const [reaction, setReaction] = useState<ReactionValue | null>(null);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);

  useEffect(() => {
    if (!reactionMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setReactionMenuOpen(false);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setReactionMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [reactionMenuOpen, buttonRef, menuRef]);

  const ensureAuthenticated = useCallback(() => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return false;
    }
    return true;
  }, [dispatch, session?.authenticated]);

  const handleReactionButtonClick = useCallback(() => {
    if (!ensureAuthenticated()) return;
    setReactionMenuOpen((prev) => !prev);
  }, [ensureAuthenticated]);

  const handleReactionChange = useCallback(
    (value: ReactionValue) => {
      if (!ensureAuthenticated()) return;
      setReaction((prev) => (prev === value ? null : value));
      setReactionMenuOpen(false);
    },
    [ensureAuthenticated],
  );

  return {
    reaction,
    setReaction,
    reactionMenuOpen,
    setReactionMenuOpen,
    handleReactionButtonClick,
    handleReactionChange,
  };
};
