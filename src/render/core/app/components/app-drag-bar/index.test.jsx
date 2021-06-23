import React from 'react'
import { shallow } from 'enzyme'
import DragBar from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('DragBar component', () => {
  it('should render', () => {
    const dragBarComponent = shallow(<DragBar />)
    expect(dragBarComponent).toMatchSnapshot()
  })
})
