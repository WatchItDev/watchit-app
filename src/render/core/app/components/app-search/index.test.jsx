import React from 'react'
import { shallow } from 'enzyme'
import Search from './index'
import 'jest-styled-components'

const movie = { search: async () => {} }

/* eslint-disable no-undef */
describe('Search component', () => {
  it('should render', () => {
    const searchComponent = shallow(<Search movies={movie} />)
    expect(searchComponent).toMatchSnapshot()
  })
})
