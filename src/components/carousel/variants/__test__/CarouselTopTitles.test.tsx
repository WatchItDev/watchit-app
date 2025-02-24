import '../../../../../__mocks__/lens-protocol-react'
import '../../../../../__mocks__/lens-protocol-react-web'
import '../../../../../__mocks__/web3auth'
import { describe, it, expect } from 'vitest'
import { CarouselTopTitlesProps } from '@src/components/carousel/types'
import CarouselTopTitles from '@src/components/carousel/variants/CarouselTopTitles'
import { Testing } from '@src/utils/testing/Testing'

describe('[COMPONENTS]: CarouselTopTitles', () => {
  const mockPosts = [
    {
      id: '1',
      metadata: {
        title: 'Test Title 1',
        content: 'Test Content 1',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri-1' } } },
        ],
      },
    },
    {
      id: '2',
      metadata: {
        title: 'Test Title 2',
        content: 'Test Content 2',
        attachments: [
          { altTag: 'poster', image: { raw: { uri: 'poster-uri-2' } } },
        ],
      },
    },
  ]

  const defaultProps: CarouselTopTitlesProps = {
    posts: mockPosts,
    category: 'Test Category',
  }

  it('to match snapshot', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />).baseElement).toMatchSnapshot()
  })

  it('renders the correct number of slides', () => {
    const slides = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />).container.querySelectorAll('.slick-slide:not(.slick-cloned)')
    expect(slides.length).toBe(mockPosts.length)
  })

  it('renders the correct poster URIs', () => {
    const { getAllByAltText } = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />)
    expect(getAllByAltText('Test Title 1')[1]).toHaveAttribute('src', 'poster-uri-1')
  })

  it('renders the title correctly', () => {
    expect(Testing.renderWithStoreAndRouter(<CarouselTopTitles {...defaultProps} />).getAllByText('Test Title 1')).to.have.length(2)
  })

  it('handles empty posts gracefully', () => {
    const emptyProps = { ...defaultProps, posts: [] }
    const slides = Testing.renderWithStoreAndRouter(<CarouselTopTitles {...emptyProps} />).container.querySelectorAll('.slick-slide')
    expect(slides.length).toBe(0)
  })
})
