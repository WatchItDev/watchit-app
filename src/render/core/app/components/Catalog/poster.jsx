import React from 'react'
import Image from '@components/Image/'
import PulseLoader from '@components/PulseLoader/'

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
      <div className='col relative movies-poster padding-left-2 padding-right-2 item' style={{ width: `${this.props.itemWidth}px`, height: `${this.props.itemHeight}px` }}>
        {
          // Show loader if empty result before load
          this.props.empty && <PulseLoader />
        }
        {
          !this.props.empty &&
            <a href='/#' onClick={this.handleClick}>
              {/* Image Box */}
              <Image src={this.props.image} preload={this.props.preload} />
              {/* Label Box */}
              <div className='hover-poster-box full-width full-height'>
                <div className='hover-info absolute bottom-1-rem'>
                  <strong className='white-text truncate'>
                    {this.props.title}
                  </strong>
                  <span className='green-text'>
                    <i className='icon-calendar margin-right-3-p' />
                    {this.props.year}
                  </span>
                  <span className='orange-text margin-left-5-p'>
                    <i className='icon-star margin-right-2-p' />
                    {this.props.rating}
                  </span>
                </div>
              </div>
            </a>
        }
      </div>
    )
  }
}
