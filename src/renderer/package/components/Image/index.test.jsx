import React from 'react'
import { shallow, mount } from 'enzyme'
import settings from '@/renderer/settings'
import Image from './index'

/* eslint-disable no-undef */
describe('<Image />', () => {
  const src = 'https://ipfs.filebase.io/ipfs/QmcdLW9p1dcYYKBHZdRXEXA4go6Qd3C4ce12khyiCqVNaH/image/medium.jpg'

  it('should render', () => {
    const imageComponent = shallow(<Image src={src} />)
    expect(imageComponent).toMatchSnapshot()
  })

  // eslint-disable-next-line no-undef
  it('should render with random gateway', () => {
    const imageComponent = mount(<Image src={src} />)
    const imageEl = imageComponent.instance().img
    // Image link built using at least one gateway
    const match = settings.gateways().some(gateway => imageEl.src.includes(gateway))
    // eslint-disable-next-line no-undef
    expect(match).toBeTruthy()
  })

  // eslint-disable-next-line no-undef
  it('should not render with empty src', () => {
    try {
      shallow(<Image src='' />)
    } catch (e) {
      // eslint-disable-next-line no-undef
      expect(e).toBeInstanceOf(Error)
    }
  })
})
