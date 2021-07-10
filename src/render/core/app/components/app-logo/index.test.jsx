import React from 'react'
import { shallow, mount } from 'enzyme'
import Logo from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('Logo component', () => {
  it('should render', () => {
    const logoComponent = shallow(<Logo />)
    expect(logoComponent).toMatchSnapshot()
  })

  it('should display valid image + text', () => {
    const logoComponent = mount(<Logo />)
    const imageEl = logoComponent.find('img')
    expect(imageEl.exists()).toEqual(true)
    expect(imageEl.instance().src).toContain('icon.png')
    expect(logoComponent.text()).toEqual('ATCHIT')
  })

  it('should not display logo with show = false', () => {
    const logoComponent = shallow(<Logo show={false} />)
    expect(logoComponent).toHaveStyleRule('display', 'none')
  })

  it('should display logo with show = true', () => {
    const logoComponent = shallow(<Logo show />)
    expect(logoComponent).toHaveStyleRule('display', 'flex')
  })
})
