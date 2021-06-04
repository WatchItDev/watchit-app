import React from 'react'
import { shallow } from 'enzyme'
import Logo from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('Logo component', () => {
  it('should render', () => {
    const alertComponent = shallow(<Logo />)
    expect(alertComponent).toMatchSnapshot()
  })
})
