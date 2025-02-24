import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CarouselArrows from '@src/components/carousel/components/CarouselArrows'

describe('[COMPONENTS]: CarouselArrows component testing', () => {
  it('to match snapshot', () => {
    const { baseElement } = render(<CarouselArrows onNext={() => {}} onPrev={() => {}} />)
    expect(baseElement).toMatchSnapshot()
  })

  it('calls onNext function when right arrow is clicked', () => {
    const onNextMock = vi.fn()
    const { getByTestId } = render(<CarouselArrows onNext={onNextMock} onPrev={() => {}} />)
    const rightArrow = getByTestId('rightButton')
    fireEvent.click(rightArrow)
    expect(onNextMock).toHaveBeenCalledTimes(1)
  })

  it('calls onPrev function when left arrow is clicked', () => {
    const onPrevMock = vi.fn()
    const { getByTestId } = render(<CarouselArrows onNext={() => {}} onPrev={onPrevMock} />)
    const leftArrow = getByTestId('leftButton')
    fireEvent.click(leftArrow)
    expect(onPrevMock).toHaveBeenCalledTimes(1)
  })

  it('renders left arrow icon correctly', () => {
    const { getByTestId } = render(<CarouselArrows onNext={() => {}} onPrev={() => {}} />)
    const leftArrow = getByTestId('leftButton')
    expect(leftArrow).toBeInTheDocument()
  })

  it('renders right arrow icon correctly', () => {
    const { getByTestId } = render(<CarouselArrows onNext={() => {}} onPrev={() => {}} />)
    const rightArrow = getByTestId('rightButton')
    expect(rightArrow).toBeInTheDocument()
  })

  it('renders correctly with children', () => {
    const { baseElement } = render(
      <CarouselArrows onNext={() => {}} onPrev={() => {}}>
        <div>Child Content</div>
      </CarouselArrows>
    )
    expect(baseElement).toMatchSnapshot()
  })
})
