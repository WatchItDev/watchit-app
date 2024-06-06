import React from 'react'
import uid from 'shortid'
import PropTypes from 'prop-types'
import CatalogPoster from '@components/Poster'
import gateway from '@helpers/gateway'

export default class CatalogRow extends React.Component {
  static get propTypes () {
    return {
      chunk: PropTypes.array.isRequired
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className='clearfix row-img' style={this.props.style}>
        {!this.props.empty && this.props.chunk.map((i) => {
          return (
            <CatalogPoster
              key={i._id || uid.generate()} id={i._id}
              title={i.meta?.title} rating={i.meta?.rating ?? 0} year={i.meta?.year}
              image={gateway.parse(i?.images?.medium)}
              onClick={() => { this.props.onClick(i._id); }}
              onPlay={() => { this.props.onPlay(i._id); }}
              {...this.props} {...i}
            />
          )
        })}
        {
          (this.props.chunk.length < this.props.chunkSize) && !this.props.empty &&
                Array(this.props.chunkSize - this.props.chunk.length).fill(0).map(() => {
                  return <CatalogPoster key={uid.generate()} empty end={this.props.end} />
                })
        }
      </div>
    )
  }
}
