import React from 'react'
import { shallow, mount } from 'enzyme'
import settings from '@settings'
import Image from './index'

/* eslint-disable no-undef */
describe('Image component', () => {
  const props = { index: 'image.jpg', cid: 'QmcdLW9p1dcYYKBHZdRXEXA4go6Qd3C4ce12khyiCqVNaH' }

  it('should render', () => {
    const imageComponent = shallow(<Image src={props} />)
    expect(imageComponent).toMatchSnapshot()
  })

  it('should render with absolute `cid`', () => {
    const imageComponent = shallow(<Image src={{ cid: props.cid }} />)
    expect(imageComponent).toMatchSnapshot()
  })

  // eslint-disable-next-line no-undef
  it('should render with random gateway', () => {
    const imageComponent = mount(<Image src={props} />)
    const imageEl = imageComponent.instance().img
    // Image link built using at least one gateway
    const match = settings.gateways.some(gateway => ~imageEl.src.indexOf(gateway))
    // eslint-disable-next-line no-undef
    expect(match).toBeTruthy()
  })

  // eslint-disable-next-line no-undef
  it('should render with relative `cid` and `index`', () => {
    const imageComponent = shallow(<Image src={props} />)
    const componentProps = imageComponent.instance().props

    /* eslint-disable no-undef */
    expect(componentProps.src).toBeInstanceOf(Object)
    expect(componentProps.src.cid).toBe(props.cid)
    expect(componentProps.src.index).toBe(props.index)
  })

  // eslint-disable-next-line no-undef
  it('should not render with empty src', () => {
    try {
      const emptyObj = {}
      shallow(<Image src={emptyObj} />)
    } catch (e) {
      // eslint-disable-next-line no-undef
      expect(e).toBeInstanceOf(Error)
    }
  })

  // eslint-disable-next-line no-undef
  it('should not render without `cid`', () => {
    try {
      const withoutCID = { index: 'image.jpg' }
      shallow(<Image src={withoutCID} />)
    } catch (e) {
      // eslint-disable-next-line no-undef
      expect(e).toBeInstanceOf(Error)
    }
  })
})
