import React from 'react'
import { shallow, mount } from 'enzyme'
import settings from 'settings'
import Image from './index'

// eslint-disable-next-line no-undef
describe('Image component', () => {
  // eslint-disable-next-line no-undef
  it('should render image', () => {
    const emptyObj = {}
    const image = shallow(<Image src={emptyObj} />)
    // eslint-disable-next-line no-undef
    expect(image).toMatchSnapshot()
  })

  // eslint-disable-next-line no-undef
  it('should render image with random gateway', () => {
    const props = { image: 'image.jpg', cid: 'QmcdLW9p1dcYYKBHZdRXEXA4go6Qd3C4ce12khyiCqVNaH' }
    const imageComponent = mount(<Image src={props} />)
    const imageEl = imageComponent.instance()
    console.log(imageEl.img)
    // eslint-disable-next-line no-undef
    expect(settings.gateways).toMatch(imageEl.src)
  })

  // it('should render image box with valid uri', () => {
  //   act(() => {
  //     render(<Image src="large_cover_image.jpg"/>, container)
  //   })
  //
  //   expect(container.querySelector('img').src).toBe(
  //     'http://localhost/test/large_cover_image.jpg'
  //   )
  // })
})
