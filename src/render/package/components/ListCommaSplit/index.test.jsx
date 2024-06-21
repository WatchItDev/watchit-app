import React from 'react'
import { shallow } from 'enzyme'
import ListCommaSplit from './index'
import FlowText from '@/render/package/components/FlowText'
import 'jest-styled-components'

/* eslint-disable no-undef */
describe('<ListCommaSplit />', () => {
  it('should render', () => {
    const backgroundComponent = shallow(<ListCommaSplit list={[]} />)
    expect(backgroundComponent).toMatchSnapshot()
  })

  it('should display list split by comma', () => {
    const commaSplit = ['test', 'movie']
    const listCommaSplitComponent = shallow(<ListCommaSplit list={commaSplit} />)
    const wrapper = listCommaSplitComponent.find(FlowText)

    wrapper.forEach((node, i) => {
      expect(node.text()).toEqual(commaSplit[i])
    })
  })
})
