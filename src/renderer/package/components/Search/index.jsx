import React, { useState, useCallback, useContext } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Context } from '@/renderer/package/runtime/context'
import Input from '@/renderer/package/components/Input/'
import utilHelper from '@/renderer/util'
import SearchResult from './result'

const SearchWrapper = styled.div`
  width: 45%;
  position: relative;

  @media (max-width: 800px) {
    width: 100%;
  }
`

let searchTimeout = null // debounce timeout
const Search = (props) => {
  const context = useContext(Context)
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
        context.db.connect(props.cid).search(
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

Search.propTypes = {
  cid: PropTypes.string.isRequired
}

export default React.memo(Search)
