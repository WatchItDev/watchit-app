import React from 'react'
import { shallow } from 'enzyme'
import Background, { Slogan, BackgroundWrapper } from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<Background />', () => {
  it('should render', () => {
    const backgroundComponent = shallow(<Background />)
    expect(backgroundComponent).toMatchSnapshot()
  })

  it('should display background 100% with prop `absolute`', () => {
    const backgroundComponent = shallow(<Background absolute />)
    const wrapper = backgroundComponent.find(BackgroundWrapper)
    expect(wrapper).toHaveStyleRule('width', '100%')
    expect(wrapper).toHaveStyleRule('height', '100%')
    expect(wrapper).toHaveStyleRule('position', 'absolute')
  })

  it('should display slogan with prop showLogo = `true`', () => {
    const backgroundComponent = shallow(<Background showLogo />)
    const slogan = backgroundComponent.find(Slogan)
    expect(slogan).toHaveStyleRule('display', 'inline-block')
  })

  it('should not display slogan with prop showLogo = `false`', () => {
    const backgroundComponent = shallow(<Background showLogo={false} />)
    const slogan = backgroundComponent.find(Slogan)
    expect(slogan).toHaveStyleRule('display', 'none')
  })
})
