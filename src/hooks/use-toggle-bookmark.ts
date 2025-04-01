import { useBookmarkToggle } from '@lens-protocol/react-web';
import { useDispatch } from 'react-redux';
import { addBookmark, removeBookmark } from '@redux/bookmark';
import { useAuth } from '@src/hooks/use-auth';
import { openLoginModal } from '@redux/auth';
// @ts-expect-error No error in this context
import {Post} from "@lens-protocol/api-bindings/dist/declarations/src/lens/graphql/generated"


export const useToggleBookmark = () => {
  const { execute: toggleBookMarkFunction, loading: loadingBookMark } = useBookmarkToggle();
  const { session: sessionData } = useAuth();
  const dispatch = useDispatch();

  const toggleBookMark = async (post: Post) => {
    if (!sessionData?.authenticated) {
      dispatch(openLoginModal());
      return;
    }

    try {
      if (!post?.operations?.hasBookmarked) {
        dispatch(addBookmark(post));
      } else {
        dispatch(removeBookmark(post?.id));
      }

      await toggleBookMarkFunction({
        publication: post,
      });
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return {
    toggleBookMark,
    loadingBookMark,
  };
};
