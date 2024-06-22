import React from 'react'
import NavBarMenu from '@/renderer/package/components/NavBarMenu/'

export default class CatalogNavBar extends React.Component {
  constructor(props) {
    super(props)
    // Initial state
    this.state = {
      sort: [{
        label: 'Year',
        action: 'meta.year',
        default: true
      }, {
        label: 'Title',
        action: 'meta.title'
      }, {
        label: 'Runtime',
        action: 'meta.runtime'
      }, {
        label: 'Rating',
        action: 'meta.rating'
      }],
      genres: [{
        label: 'All',
        action: 'All',
        default: true
      }, {
        label: 'Action',
        action: 'Action'
      }, {
        label: 'Adventure',
        action: 'Adventure'
      }, {
        label: 'Animation',
        action: 'Animation'
      }, {
        label: 'Biography',
        action: 'Biography'
      }, {
        label: 'Comedy',
        action: 'Comedy'
      }, {
        label: 'Crime',
        action: 'Crime'
      }, {
        label: 'Documentary',
        action: 'Documentary'
      }, {
        label: 'Drama',
        action: 'Drama'
      }, {
        label: 'Family',
        action: 'Family'
      }, {
        label: 'Fantasy',
        action: 'Fantasy'
      }, {
        label: 'Film-Noir',
        action: 'Film-Noir'
      }, {
        label: 'Game-Show',
        action: 'Game-Show'
      }, {
        label: 'History',
        action: 'History'
      }, {
        label: 'Horror',
        action: 'Horror'
      }, {
        label: 'Music',
        action: 'Music'
      }, {
        label: 'Musical',
        action: 'Musical'
      }, {
        label: 'News',
        action: 'News'
      }, {

        label: 'Mystery',
        action: 'Mystery'
      }, {
        label: 'Romance',
        action: 'Romance'
      }, {
        label: 'Reality-TV',
        action: 'Reality-TV'
      }, {
        label: 'Sci-Fi',
        action: 'Sci-Fi'
      }, {
        label: 'Sport',
        action: 'Sport'
      }, {
        label: 'Talk-Show',
        action: 'Talk-Show'
      }, {
        label: 'Thriller',
        action: 'Thriller'
      }, {
        label: 'War',
        action: 'War'
      }, {
        label: 'Western',
        action: 'Western'
      }]
    }

  }

  shouldComponentUpdate() {
    return false
  }

  onChange(type, e) {
    // OnChange
    if (this.props.onChange) {
      this.props.onChange(type, e)
    }

  }

  handleSortBy = (e) => this.onChange('sort_by', e)
  handleGenres = (e) => this.onChange('genres', e)

  render() {
    return (
      <div className='nav-wrapper main-nav-filter-movies'>
        <NavBarMenu
          btnText='Sort By' list={this.state.sort}
          onChange={this.handleSortBy}
        />

        <NavBarMenu
          btnText='Genre' list={this.state.genres}
          onChange={this.handleGenres}
        />
      </div>
    )
  }
}
