import orderBy from 'lodash/orderBy';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
// hooks
import { useDebounce } from 'src/hooks/use-debounce';
// _mock
import { POST_SORT_OPTIONS } from 'src/_mock';
// api
import { useGetPosts, useSearchPosts } from 'src/api/blog';
// components
import { useSettingsContext } from 'src/components/settings';
// types
import { IPostItem } from 'src/types/blog';
//
import PostList from '../post-list';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function PostListHomeView() {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const { posts, postsLoading } = useGetPosts();

  const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyFilter({
    inputData: posts,
    sortBy,
  });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Blog
      </Typography>

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <PostSearch
          query={debouncedQuery}
          results={searchResults}
          onSearch={handleSearch}
          loading={searchLoading}
          hrefItem={(title: string) => paths.post.details(title)}
        />

        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      <PostList posts={dataFiltered} loading={postsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, sortBy }: { inputData: IPostItem[]; sortBy: string }) => {
  if (sortBy === 'latest') {
    return orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    return orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    return orderBy(inputData, ['totalViews'], ['desc']);
  }

  return inputData;
};
