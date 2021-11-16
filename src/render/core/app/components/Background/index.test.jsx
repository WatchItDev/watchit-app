import React from 'react'
import { shallow } from 'enzyme'
import Background from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<Background />', () => {
  it('should render', () => {
    const backgroundComponent = shallow(<Background />)
    expect(backgroundComponent).toMatchSnapshot()
  })
})
