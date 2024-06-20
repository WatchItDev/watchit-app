import React, { useState, useCallback } from 'react'
import { DB as db } from '@main/bridge'
import Input from '@components/Input/'
import utilHelper from '@helpers/util'
import SearchResult from './result'
import { Box, styled } from '@mui/material';

let searchTimeout = null; // debounce timeout

const Search = (props) => {
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(false)

  const handleSearch = useCallback((e) => {
    // //The incoming value;
    const targetValue = e.target.value
    const invalidInput = utilHelper.invalidString(targetValue)

    // Debounce
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Empty write
    if (invalidInput) {
      setSearchResult(false)
      setSearching(false)
    } else {
      // Searching
      setSearching(true)
    }

    // Set time out
    searchTimeout = setTimeout(() => {
      // Check invalid
      if (!invalidInput) {
        db.connect(props.cid).search(
          targetValue
        ).then((res) => {
          setSearchResult(res)
          setSearching(false)
        }).catch(() => {
          setSearchResult([])
          setSearching(false)
        })
      }
    }, 1000)
  }, [])

  const handleClick = (id) => {
    setSearchResult(false)
    setSearching(false)
    props.onClick && props.onClick(id)
  }

  return (
    <SearchWrapper>
      {/* Search result box */}
      <Input
        icon='icon-tv' onInput={handleSearch} required
        autoComplete='off' type='text' placeholder='Search...' name='search'
        {...!searching && !searchResult ? { value: '' } : {}}
      />
      {
        (searching || searchResult) &&
        <SearchResult
          searching={searching}
          result={searchResult}
          onClick={handleClick}
        />
      }
    </SearchWrapper>
  )
}

const SearchWrapper = styled(Box)(({ theme }) => ({
  width: '45%',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export default React.memo(Search)
