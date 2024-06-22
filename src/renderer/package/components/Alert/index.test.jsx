import React from 'react'
import { shallow } from 'enzyme'
import Alert from './index'
import settings from '@/renderer/settings'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<Alert />', () => {
  it('should render', () => {
    const alertComponent = shallow(<Alert />)
    expect(alertComponent).toMatchSnapshot()
  })

  it('should render with prop color', () => {
    const color = settings.styles.colors.danger
    const alertComponent = shallow(<Alert color={color} />)
    expect(alertComponent).toHaveStyleRule('background-color', color)
  })
})
