import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';
import { useAuth } from '@src/hooks/use-auth';
import { useBookmarks } from '@src/hooks/use-bookmark';
import type { Post } from '@src/graphql/generated/graphql';

export const useToggleBookmark = () => {
  const { session } = useAuth();
  const dispatch = useDispatch();
  const { has } = useBookmarks();
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(
    async (_post: Post) => {
      if (!session?.authenticated) {
        dispatch(openLoginModal());
        return;
      }

      // No backend endpoint available; act as a no-op while showing feedback.
      setLoading(true);
      try {
        console.warn('Bookmark toggle is not available on this backend.');
      } finally {
        setLoading(false);
      }
    },
    [dispatch, session?.authenticated],
  );

  return { toggle, loading, has };
};
