import { useCallback, useState } from 'react';
import { useToggleBookmarkMutation } from '@src/graphql/generated/hooks';
import { useAuth } from '@src/hooks/use-auth';
import { useBookmarks } from '@src/hooks/use-bookmark';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@redux/auth';
import { addBookmark, removeBookmark } from '@redux/bookmark';
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
        const { data } = await mutate({
          variables: { input: { postId: post.id } },
        });

        if (data?.toggleBookmark) {
          dispatch(addBookmark(post));
        } else {
          dispatch(removeBookmark(post.id));
        }

        await refetch();
      } catch (err) {
        console.error('Error toggling bookmark:', err);
      } finally {
        setLoading(false);
      }
    },
    [session?.authenticated],
  );

  return { toggle, loading };
};
