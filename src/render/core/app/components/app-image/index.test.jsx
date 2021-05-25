import React from 'react'
import { shallow } from 'enzyme'
import settings from 'settings'
import Image from './index'

describe('Image component', () => {

  it('should render image', () => {
    const image = shallow(<Image src={}/>)
    expect(image).toMatchSnapshot()
  })

  it('should render image with random gateway', () => {
    const props = {'image':'image.jpg', 'cid':'QmcdLW9p1dcYYKBHZdRXEXA4go6Qd3C4ce12khyiCqVNaH'}
    const image = shallow(<Image src={props}/>)
    expect(settings.gateways).toMatch(image.src)
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
