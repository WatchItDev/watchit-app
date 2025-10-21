import { useCallback, useEffect, useState } from 'react';
import { EdgeState } from '@src/graphql/generated/graphql';
import { useGetEdgeStatusLazyQuery, useSetEdgeStatusMutation } from '@src/graphql/hooks/edge';
import { openLoginModal } from '@redux/auth';
import type { AppDispatch } from '@src/redux/store';
import type { ReduxSession } from '@redux/types';

interface UseFollowEdgeStatusArgs {
  authorId?: number | null;
  authorAddress?: string | null;
  session: ReduxSession | null;
  dispatch: AppDispatch;
}

interface UseFollowEdgeStatusResult {
  isFollowing: boolean;
  isFetching: boolean;
  toggleFollow: () => Promise<void>;
  followDisabled: boolean;
  loading: boolean;
}

/**
 * Tracks and toggles the follow edge status for a publication author.
 */
export const useFollowEdgeStatus = ({
  authorId,
  authorAddress,
  session,
  dispatch,
}: UseFollowEdgeStatusArgs): UseFollowEdgeStatusResult => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [getEdgeStatus] = useGetEdgeStatusLazyQuery();
  const [setEdgeStatus, { loading }] = useSetEdgeStatusMutation();

  useEffect(() => {
    let mounted = true;
    if (!authorId) {
      setIsFetching(false);
      return () => {};
    }
    setIsFetching(true);
    getEdgeStatus({ variables: { input: { toUserId: authorId } } })
      .then((res) => {
        if (!mounted) return;
        const status = res.data?.getEdgeStatus?.isFollowing ?? false;
        setIsFollowing(status);
        setIsFetching(false);
      })
      .catch(() => {
        if (!mounted) return;
        setIsFollowing(false);
        setIsFetching(false);
      });
    return () => {
      mounted = false;
    };
  }, [authorId, getEdgeStatus]);

  const toggleFollow = useCallback(async () => {
    if (!session?.authenticated) {
      dispatch(openLoginModal());
      return;
    }
    if (!authorId) return;

    const nextState = !isFollowing;
    try {
      await setEdgeStatus({
        variables: {
          input: {
            toUserId: authorId,
            status: nextState ? EdgeState.Follow : EdgeState.None,
          },
        },
      });
      setIsFollowing(nextState);
    } catch (error) {
      console.error('useFollowEdgeStatus#setEdgeStatus', error);
    }
  }, [authorId, dispatch, isFollowing, setEdgeStatus, session?.authenticated]);

  const followDisabled =
    isFetching ||
    loading ||
    !authorAddress ||
    authorAddress === session?.user?.address;

  return { isFollowing, isFetching, toggleFollow, followDisabled, loading };
};
