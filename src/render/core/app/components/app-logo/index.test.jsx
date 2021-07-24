import React from 'react'
import { shallow, mount } from 'enzyme'
import Logo, { LogoWrapper } from './index'
import 'jest-styled-components'
import Background, { Slogan } from '../app-background'

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

  it('should display scale 1 with thumbnail = `true`', () => {
    const logoComponent = shallow(<Logo thumbnail />)
    const wrapper = logoComponent.find(LogoWrapper)
    expect(wrapper).toHaveStyleRule('transform', 'scale(1)')
  })

  it('should display full with thumbnail = `false`', () => {
    const logoComponent = shallow(<Logo thumbnail={false} />)
    const wrapper = logoComponent.find(LogoWrapper)
    expect(wrapper).toHaveStyleRule('transform', 'scale(3) translateY(-1.8rem)')
  })
})
