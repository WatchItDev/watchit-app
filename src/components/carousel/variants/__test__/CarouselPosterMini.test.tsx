import '../../../../../__mocks__/lens-protocol-react'
import '../../../../../__mocks__/lens-protocol-react-web'
import '../../../../../__mocks__/web3auth'
import { describe, it, expect } from 'vitest'
import { CarouselPosterMiniProps } from '@src/components/carousel/types'
import CarouselPosterMini from '@src/components/carousel/variants/CarouselPosterMini'
import { Testing } from '@src/utils/testing/Testing'

describe('[COMPONENTS]: CarouselPosterMini', () => {
  const mockData = [
    {
      id: '1',
      metadata: {
        title: 'Test Title',
        content: 'Test Content',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri' } } },
          { altTag: 'wallpaper', image: { raw: { uri: 'wallpaper-uri' } } },
        ],
      },
      globalStats: { upvotes: 10 },
    }
  ]

  const defaultProps: CarouselPosterMiniProps = {
    data: mockData,
    title: 'Test Carousel',
    minItemWidth: 100,
    maxItemWidth: 200,
  }

  it('to match snapshot', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).baseElement).toMatchSnapshot()
  })

  it('renders the correct number of slides', () => {
    const slides = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).container.querySelectorAll('.slick-slide')
    expect(slides.length).toBe(1)
  })

  it('renders the correct poster URIs', () => {
    const { getAllByAltText } = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />)
    expect(getAllByAltText('Test Title')[0]).toHaveAttribute('src', 'poster-uri')
  })

  it('renders the title correctly', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselPosterMini {...defaultProps} />).getByText('Test Carousel')).toBeInTheDocument()
  })

  it('handles empty data gracefully', () => {
    const emptyProps = { ...defaultProps, data: [] }
    const slides = Testing.renderWithStoreAndRouter(<CarouselPosterMini {...emptyProps} />).container.querySelectorAll('.slick-slide')
    expect(slides.length).toBe(0)
  })
})
