import React from 'react'
import { shallow } from 'enzyme'
import Stats from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<Stats />', () => {
  it('should render', () => {
    const statsComponent = shallow(<Stats />)
    expect(statsComponent).toMatchSnapshot()
  })
})
