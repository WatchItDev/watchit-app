import React from 'react'
import Image from 'components/app-image/'

export default class CatalogSearchResultItem extends React.PureComponent {
    onClick = () => {
      this.props.onClick &&
        this.props.onClick(this.props._id)
    };

    render () {
      return (
        <li className='transparent collection-item padding-5 no-border d-flex pointer' onClick={this.onClick}>
          <div className='result-search-box-img'>
            <Image src={this.props.image} preload pulseStyle={{ position: 'relative' }} />
          </div>
          <div className='result-search-box-content flex-grow-1'>
            <div className='search-result-box-title'>
              <strong className='white-text truncate'>
                {this.props.title}
              </strong>
            </div>
            <div className='margin-top-1-p search-result-box-details'>
              <span className='green-text'>
                <i className='icon-calendar margin-right-1-p' />
                {this.props.year}
              </span>
              <span className='orange-text margin-left-3-p'>
                <i className='icon-star margin-right-1-p' />
                {this.props.rating}
              </span>
              <span className='red-text margin-left-3-p'>
                <i className='icon-back-in-time margin-right-1-p' />
                {this.props.runtime}
              </span>
            </div>
          </div>
        </li>
      )
    }
}
