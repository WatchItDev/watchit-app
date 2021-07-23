import React from 'react'
import settings from 'settings'
import { shallow } from 'enzyme'
import DragBar, { WindowControlIcon } from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('DragBar component', () => {
  it('should render', () => {
    const dragBarComponent = shallow(<DragBar />)
    expect(dragBarComponent).toMatchSnapshot()
  })

  it('should render with prop color', () => {
    const color = settings.styles.colors.warningDark
    const alertComponent = shallow(<WindowControlIcon color={color} />)
    expect(alertComponent).toHaveStyleRule('color', color)
  })
})
