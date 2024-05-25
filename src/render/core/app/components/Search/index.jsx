import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@components/Input/'
import { ClickAwayListener } from '@mui/material';
import styled from 'styled-components'
import utilHelper from '@helpers/util';
import SearchResult from './result';

const SearchWrapper = styled.div`
  width: 45%;
  position: relative;

  @media (max-width: 800px) {
    width: 100%;
  }
`

let searchTimeout = null // debounce timeout
const Search = (props) => {
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(false);

  const handleSearch = (e) => {
    const targetValue = e.target.value;
    const invalidInput = utilHelper.invalidString(targetValue);

    // Debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (invalidInput) {
      setSearchResult(false);
      setSearching(false);
    } else {
      setSearching(true);
    }

    searchTimeout = setTimeout(() => {
      if (!invalidInput) {
        const searchResults = props.movies.filter((movie) =>
            movie.meta.title.toLowerCase().includes(targetValue.toLowerCase())
        );
        setSearchResult(searchResults);
        setSearching(false);
      }
    }, 1000);
  };

  const handleClick = (id) => {
    setSearchResult(false);
    setSearching(false);
    props.onClick && props.onClick(id);
  };

  const handleClickAway = () => {
    setSearchResult(false);
    setSearching(false);
  };

  return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <SearchWrapper>
          <Input
              icon='icon-tv' onInput={handleSearch} required
              autoComplete='off' type='text' placeholder='Search...' name='search'
              {...!searching && !searchResult ? { value: '' } : {}}
          />
          {(searching || searchResult) && (
              <SearchResult
                  searching={searching}
                  result={searchResult}
                  onClick={handleClick}
              />
          )}
        </SearchWrapper>
      </ClickAwayListener>
  );
};

Search.propTypes = {
  movies: PropTypes.array.isRequired,
  onClick: PropTypes.func,
};

export default React.memo(Search);
