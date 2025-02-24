import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import CarouselNavigationArrows from '@src/components/carousel/components/CarouselNavigationArrows'

describe('[COMPONENTS]: CarouselNavigationArrows component testing', () => {
  const prevMock = vi.fn()

  it('renders correctly with default props', () => {
    const { baseElement } = render(<CarouselNavigationArrows next={() => {}} prev={() => {}} />)
    expect(baseElement).toMatchSnapshot()
  })

  it('calls prev function when left arrow is clicked', () => {
    const { getByTestId} = render(<CarouselNavigationArrows next={() => {}} prev={prevMock} />)
    const leftArrow = getByTestId('leftButton')
    fireEvent.click(leftArrow)
    expect(prevMock).toHaveBeenCalledTimes(1)
  })

  it('calls next function when right arrow is clicked', () => {
    const nextMock = vi.fn()
    const { getByTestId } = render(<CarouselNavigationArrows next={nextMock} prev={() => {}} />)
    const rightArrow = getByTestId('rightButton')
    fireEvent.click(rightArrow)
    expect(nextMock).toHaveBeenCalledTimes(1)
  })

  it('renders left arrow icon correctly', () => {
    const { getByTestId } = render(<CarouselNavigationArrows next={() => {}} prev={() => {}} />)
    const leftArrow = getByTestId('leftButton')
    expect(leftArrow.querySelector('svg')).toBeInTheDocument()
  })

  it('renders right arrow icon correctly', () => {
    const { getByTestId } = render(<CarouselNavigationArrows next={() => {}} prev={() => {}} />)
    const rightArrow = getByTestId('rightButton')
    expect(rightArrow.querySelector('svg')).toBeInTheDocument()
  })
})
