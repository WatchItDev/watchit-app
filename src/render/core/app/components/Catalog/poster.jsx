import React from 'react'
import Image from '@components/Image/'
import PulseLoader from '@components/PulseLoader/'
import { Box, styled } from '@mui/material'

export default class CatalogPoster extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  static get defaultProps () {
    return {
      empty: true
    }
  }

  handleClick = (e) => {
    e.preventDefault()
    this.props.onClick &&
    this.props.onClick(this.props.id)
  }

  render () {
    return (
      <PosterWrapper>
        {
          // Show loader if empty result before load
          this.props.empty && !this.props.end && <PulseLoader />
        }
        <a href='/#' onClick={this.handleClick ?? (() => {})} style={{ opacity: this.props.empty ? 0 : 1, pointerEvents: this.props.empty ? 'none' : 'all' }}>
          {/* Image Box */}
          <Image src={this.props.image ?? 'https://i0.wp.com/www.themoviedb.org/t/p/w185/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg'} preload={this.props.preload}/>
          <div className='hover-poster-box full-width full-height'>
            <div className='hover-info absolute bottom-1-rem'>
              <strong className='white-text truncate'>
                {this.props.title ?? ''}
              </strong>
              <span className='green-text'>
                    <i className='icon-calendar margin-right-3-p'/>
                {this.props.year ?? ''}
                  </span>
              <span className='orange-text margin-left-5-p'>
                    <i className='icon-star margin-right-2-p'/>
                {this.props.rating ?? ''}
                  </span>
            </div>
          </div>
        </a>
      </PosterWrapper>
    )
  }
}

export const PosterWrapper = styled(Box)(() => ({
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  position: 'relative'
}))
