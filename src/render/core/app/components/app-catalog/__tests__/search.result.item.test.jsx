import React from 'react'
import { shallow } from 'enzyme'
import CatalogSearchResultItem from '../search.result.item'
import 'jest-styled-components'

const image = {
  cid: 'QmeHpMM7QKJ9Abd36qjUYrdH8S7SUF2bGt4FgpnKQAJ7Tn',
  index: 'small.jpg'
}

/* eslint-disable no-undef */
describe('Search Result Item component', () => {
  it('should render', () => {
    const searchResultItemComponent = shallow(<CatalogSearchResultItem image={image} />)
    expect(searchResultItemComponent).toMatchSnapshot()
  })
})
