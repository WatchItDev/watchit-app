import React from 'react'
import { shallow, mount } from 'enzyme'
import Input from './index'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<Input />', () => {
  it('should render', () => {
    const inputComponent = shallow(<Input />)
    expect(inputComponent).toMatchSnapshot()
  })

  it('should contain input element', () => {
    const inputComponent = mount(<Input />)
    const inputEl = inputComponent.exists('input')
    expect(inputEl).toBeTruthy()
  })

  it('should handle input event', () => {
    const inputComponent = mount(<Input />)
    const inputEl = inputComponent.find('input')
    const inputValue = 'Hello World!!'

    inputEl.simulate('change', { target: { value: inputValue } })
    expect(inputEl.instance().value).toEqual(inputValue)
  })
})
