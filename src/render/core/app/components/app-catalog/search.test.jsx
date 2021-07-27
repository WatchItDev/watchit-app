import React from 'react'
import { shallow } from 'enzyme'
import CatalogSearch from './search'
import 'jest-styled-components'

const movie = { search: async () => {} }

/* eslint-disable no-undef */
describe('Search component', () => {
  it('should render', () => {
    const searchComponent = shallow(<CatalogSearch movies={movie} />)
    expect(searchComponent).toMatchSnapshot()
  })
})
