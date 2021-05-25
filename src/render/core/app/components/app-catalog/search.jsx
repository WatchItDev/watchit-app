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

    onSearch = (e) => {
      // //The incoming value;
      const _target_value = e.target.value
      const _invalid_input = utilHelper.invalidString(_target_value)

      // Remove old timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Empty write
      if (_invalid_input) {
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
        if (!_invalid_input)
        // Get movies by search
        {
          this.props.movies.search(
            _target_value
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

    onResultCLick = (id) => {
      this.searchRef.input.ref.value = ''
      this.setState({ searching: false, searchResult: false }, () => {
        this.props.onClick && this.props.onClick(id)
      })
    };

    getRef = (ref) => {
      this.searchRef = ref
    }

    render () {
      return (
        <>
          {/* Search result box */}
          <CatalogSearchInput
            onInput={this.onSearch} size='m12 l12'
            ref={this.getRef}
          />
          {
                    (this.state.searching || this.state.searchResult) &&
                      <CatalogSearchResult
                        searching={this.state.searching}
                        result={this.state.searchResult}
                        onClick={this.onResultCLick}
                      />
                }

        </>
      )
    }
}
