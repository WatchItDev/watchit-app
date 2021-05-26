import React from 'react'
import { shallow } from 'enzyme'
import Alert from './index'

/* eslint-disable no-undef */
describe('Alert component', () => {
  it('should render', () => {
    const alertComponent = shallow(<Alert />)
    expect(alertComponent).toMatchSnapshot()
  })

  // it('should render with prop color', () => {
  //   const color = settings.styles.colors.danger
  //   const alertComponent = shallow(<Alert color={color} />)
  //   const styles = alertComponent.instance().getChildContext()
  //   expect(styles.backgroundColor).toBe(color)
  // })
})
