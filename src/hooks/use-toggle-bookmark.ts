import { useCallback, useState } from 'react';
import { useToggleBookmarkMutation } from '@src/graphql/generated/hooks';
import { useAuth } from '@src/hooks/use-auth';
import { useBookmarks } from '@src/hooks/use-bookmark';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';
import { Post } from '@src/graphql/generated/graphql';

export const useToggleBookmark = () => {
  const { session } = useAuth();
  const { refetch } = useBookmarks();
  const [mutate] = useToggleBookmarkMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const toggle = useCallback(
    async (post: Post) => {
      if (!session?.authenticated) {
        dispatch(openLoginModal());
        return;
      }

      try {
        setLoading(true);
        await mutate({ variables: { input: { postId: post.id } } });
        await refetch();
      } catch (err) {
        console.error('Error toggling bookmark:', err);
      } finally {
        setLoading(false);
      }
    },
    [session?.authenticated, mutate, refetch, dispatch],
  );

  return { toggle, loading };
};
