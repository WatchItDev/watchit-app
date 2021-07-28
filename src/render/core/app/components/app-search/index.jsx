import React, { useState } from 'react'
import Input from '@components/app-inputs/'
import utilHelper from '@helpers/util'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import SearchResult from './result'

let searchTimeout = null
const SearchWrapper = styled.div`
  width: 45%;
  position: relative;

  @media (max-width: 800px) {
    width: 100%;
  }
`

const Search = (props) => {
  const [searching, setSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(false)

  const handleSearch = (e) => {
    // //The incoming value;
    const targetValue = e.target.value
    const invalidInput = utilHelper.invalidString(targetValue)

    // Remove old timeout
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
        props.movies.search(
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
  }

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

Search.propTypes = {
  movies: PropTypes.object.isRequired
}

export default React.memo(Search)
