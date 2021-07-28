import React from 'react'
import 'jest-styled-components'
import { shallow } from 'enzyme'
import PointsLoader from '@components/util-points-loader'

import SearchResult, { NoResultsText } from './result'
import SearchResultItem from './result.item'

const results = [
  {
    image: {
      cid: 'QmeHpMM7QKJ9Abd36qjUYrdH8S7SUF2bGt4FgpnKQAJ7Tn',
      index: 'small.jpg'
    },
    language: 'en',
    rating: 6.8,
    resource: {
      posters: {
        small: {
          cid: 'QmeHpMM7QKJ9Abd36qjUYrdH8S7SUF2bGt4FgpnKQAJ7Tn',
          index: 'small.jpg'
        }
      }
    },
    runtime: 90,
    title: 'Bombsight Stolen',
    year: 1941,
    _id: 'wt_loc_92'
  }
]

/* eslint-disable no-undef */
describe('Search Result component', () => {
  it('should render', () => {
    const searchResultComponent = shallow(<SearchResult />)
    expect(searchResultComponent).toMatchSnapshot()
  })

  it('should render searching spinner', () => {
    // eslint-disable-next-line
    const searchResultComponent = shallow(<SearchResult result={[]} searching={true}/>)
    const searchingSpinnerComponent = searchResultComponent.find(PointsLoader)
    expect(searchingSpinnerComponent).toHaveLength(1)
  })

  it('should render no results', () => {
    const searchResultComponent = shallow(<SearchResult result={[]} searching={false} />)
    const noResultsComponent = searchResultComponent.find(NoResultsText)
    expect(noResultsComponent).toHaveLength(1)
  })

  it('should render the results', () => {
    const searchResultComponent = shallow(<SearchResult result={results} searching={false} />)
    const searchResultItemComponent = searchResultComponent.find(SearchResultItem)
    expect(searchResultItemComponent).toHaveLength(1)
  })
})
