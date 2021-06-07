import React from 'react'
import CatalogSearchResult from './search.result'
import CatalogSearchInput from './search.input'

import utilHelper from 'helpers/util'
import PropTypes from 'prop-types'

export default class CatalogSearch extends React.PureComponent {
  constructor (props) {
    super(props)

    this.searchTimeout = null
    this.searchRef = null

    this.state = {
      searching: false,
      searchResult: false
    }
  }

  static get propTypes () {
    return {
      movies: PropTypes.object.isRequired
    }
  }

  handleSearch = (e) => {
    // //The incoming value;
    const targetValue = e.target.value
    const invalidInput = utilHelper.invalidString(targetValue)

    // Remove old timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }

    // Empty write
    if (invalidInput) {
      this.setState({
        searchResult: false,
        searching: false
      })
    } else {
      // Searching
      this.setState({
        searching: true
      })
    }

    // Set time out
    this.searchTimeout = setTimeout(() => {
      // Check invalid
      if (!invalidInput) {
        this.props.movies.search(
          targetValue
        ).then((res) => {
          this.setState({
            searchResult: res,
            searching: false
          })
        }).catch(() => {
          this.setState({
            searchResult: [],
            searching: false
          })
        })
      }
    }, 1000)
  }

  handleClick = (id) => {
    this.setState({ searching: false, searchResult: false }, () => {
      this.props.onClick && this.props.onClick(id)
    })
  }

  render () {
    return (
      <>
        {/* Search result box */}
        <CatalogSearchInput
          onInput={this.handleSearch}
          {...!this.state.searching && !this.state.searchResult ? { value: '' } : {}}
        />
        {
          (this.state.searching || this.state.searchResult) &&
            <CatalogSearchResult
              searching={this.state.searching}
              result={this.state.searchResult}
              onClick={this.handleClick}
            />
        }
      </>
    )
  }
}
