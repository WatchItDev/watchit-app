import { useState, memo, useCallback } from 'react';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog, { dialogClasses } from '@mui/material/Dialog';

import SearchNotFound from '@src/components/search-not-found';
import ResultItem from './result-item';
import Scrollbar from '@src/components/scrollbar';
import Label from '@src/components/label';
import Iconify from '@src/components/iconify';
import { useBoolean } from '@src/hooks/use-boolean';
import { useResponsive } from '@src/hooks/use-responsive';
import { useEventListener } from '@src/hooks/use-event-listener';
import { useRouter } from '@src/routes/hooks';
import { applyFilter } from './utils';
import { CircularProgress } from '@mui/material';
import { paths } from '@src/routes/paths.ts';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store.ts';
import { detectOperatingSystem } from '@src/utils/os-detection.ts';
import {
  useGetPostsLazyQuery,
  useGetUsersLazyQuery,
} from '@src/graphql/generated/hooks.tsx';
import { Post, User } from '@src/graphql/generated/graphql.ts';

function Searchbar() {
  const theme = useTheme();
  const router = useRouter();
  const search = useBoolean();
  const mdUp = useResponsive('up', 'md');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchUsers, { data: usersData, loading: loadingProfiles }] =
    useGetUsersLazyQuery();
  const [searchPosts, { data: postsData, loading: loadingPosts }] =
    useGetPostsLazyQuery();
  const profiles = usersData?.getUsers;
  const posts = postsData?.getPosts;
  const { isMac } = detectOperatingSystem();
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';
  const handleClose = useCallback(() => {
    search.onFalse();
    setSearchQuery('');
  }, [search]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (
      event.key === 'k' &&
      ((isMac && event.metaKey) || (!isMac && event.ctrlKey))
    ) {
      event.preventDefault();
      search.onToggle();
      setSearchQuery('');
      searchUsers({ variables: { query: '' } });
      searchPosts({ variables: { query: '' } });
    }
  };

  useEventListener('keydown', handleKeyDown);

  const handleClickPublication = (publicationId: string) => {
    if (!publicationId) return;

    router.push(paths.dashboard.publication.details(publicationId));
    handleClose();
  };

  const handleClickProfile = (profileId: string) => {
    if (!profileId) return;

    router.push(paths.dashboard.user.root(profileId));
    handleClose();
  };

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchQuery(value);
      searchUsers({ variables: { query: value, limit: 50 } });
      searchPosts({ variables: { query: value, limit: 50 } });
    },
    [],
  );

  const dataFiltered = applyFilter({
    inputData: [],
    query: searchQuery,
  });

  const notFound =
    searchQuery && !dataFiltered.length && !profiles?.length && !posts?.length;

  const minibarState = useSelector((state: RootState) => state.minibar.state);

  const isMini = minibarState === 'mini';
  const lgUp = useResponsive('up', 'lg');

  // If isMini and isLgUp, hide the Search text
  const hideSearchText = isMini && lgUp;

  const renderItems = () => {
    if (!searchQuery && !profiles?.length && !posts?.length) {
      return (
        <Typography
          variant="h6"
          sx={{
            py: 10,
            textAlign: 'center',
            color: 'text.secondary',
            height: 340,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          You can search for profiles and publications here.
        </Typography>
      );
    }

    return (
      <>
        {profiles &&
          profiles.map((profile: User) => (
            <List key={profile.address}>
              <ResultItem
                title={`${profile.displayName ?? profile.username}`}
                subtitle={`${profile.bio ?? profile.address}`}
                groupLabel={'Profile'}
                onClickItem={() => handleClickProfile(`${profile.address}`)}
              />
            </List>
          ))}

        {posts &&
          posts.map((publication: Post) => (
            <List key={publication.id}>
              <ResultItem
                query={searchQuery}
                title={`${publication?.title}`}
                subtitle={`${publication?.description}`}
                groupLabel={'Publication'}
                onClickItem={() => handleClickPublication(`${publication.id}`)}
              />
            </List>
          ))}
      </>
    );
  };

  const renderButton = (
    <Button
      onClick={search.onTrue}
      disableFocusRipple
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#24262A',
        borderRadius: 1.5,
        m: 1,
        p: 0.2,
        mb: !hideSearchText ? 0 : 3,
        '&:hover': { backgroundColor: '#1E1F22' },
      }}
    >
      <IconButton component={'div'} disableRipple>
        <Iconify icon="eva:search-fill" />
        {!hideSearchText && (
          <Typography
            sx={{
              ml: 1,
              // Hide on mobile
              display: { xs: 'none', lg: 'block' },
            }}
            variant="subtitle2"
          >
            Search
          </Typography>
        )}
      </IconButton>
      {mdUp && (
        <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>
          {shortcutLabel}
        </Label>
      )}
      {!isMini && !mdUp && (
        <Label sx={{ px: 0.75, mr: 1, fontSize: 12, color: 'text.secondary' }}>
          {shortcutLabel}
        </Label>
      )}
    </Button>
  );

  const loading = loadingProfiles || loadingPosts;

  return (
    <>
      {renderButton}
      <Dialog
        fullWidth
        maxWidth="sm"
        open={search.value}
        onClose={handleClose}
        transitionDuration={{
          enter: theme.transitions.duration.shortest,
          exit: 0,
        }}
        PaperProps={{ sx: { mt: 15, overflow: 'unset' } }}
        sx={{ [`& .${dialogClasses.container}`]: { alignItems: 'flex-start' } }}
      >
        <Box sx={{ p: 3, borderBottom: `solid 1px ${theme.palette.divider}` }}>
          <InputBase
            fullWidth
            autoFocus
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  width={24}
                  sx={{ color: 'text.disabled' }}
                />
              </InputAdornment>
            }
            endAdornment={
              <Label sx={{ letterSpacing: 1, color: 'text.secondary' }}>
                esc
              </Label>
            }
            inputProps={{ sx: { typography: 'h6' } }}
          />
        </Box>
        <Scrollbar sx={{ p: 3, pt: 2, height: 400 }}>
          {loading && (
            <Box
              sx={{
                width: '100%',
                height: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={32} sx={{ color: '#fff' }} />
            </Box>
          )}
          {notFound && !loading && (
            <SearchNotFound query={searchQuery} sx={{ py: 10 }} />
          )}
          {!notFound && !loading && renderItems()}
        </Scrollbar>
      </Dialog>
    </>
  );
}

export default memo(Searchbar);
