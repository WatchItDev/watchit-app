import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CarouselDots from '@src/components/carousel/components/CarouselDots'

describe('[COMPONENTS]: CarouselDots component testing', () => {
  it('appendDots renders correctly with default props', () => {
    const dots = <li>dot</li>
    const { appendDots } = CarouselDots()
    const { baseElement } = render(appendDots(dots))
    expect(baseElement).toMatchSnapshot()
  })

  it('appendDots renders correctly with rounded prop', () => {
    const dots = <li>dot</li>
    const { appendDots } = CarouselDots({ rounded: true })
    const { baseElement } = render(appendDots(dots))
    expect(baseElement).toMatchSnapshot()
  })

  it('appendDots renders correctly with custom sx prop', () => {
    const dots = <li>dot</li>
    const { appendDots } = CarouselDots({ sx: { bgcolor: 'red' } })
    const { baseElement } = render(appendDots(dots))
    expect(baseElement).toMatchSnapshot()
  })

  it('customPaging renders correctly', () => {
    const { customPaging } = CarouselDots()
    const { baseElement } = render(customPaging())
    expect(baseElement).toMatchSnapshot()
  })

  it('StyledRoot has correct styles', () => {
    const dots = <li>dot</li>
    const { appendDots } = CarouselDots()
    const { getByRole } = render(appendDots(dots))
    const ulElement = getByRole('list')
    expect(ulElement).toHaveStyle(`
      z-index: 9;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    `)
  })
})
