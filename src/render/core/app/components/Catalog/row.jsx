import React from 'react'
import uid from 'shortid'
import PropTypes from 'prop-types'
import CatalogPoster from './poster'
import { Box, styled } from '@mui/material'

export default class CatalogRow extends React.Component {
  static get propTypes () {
    return {
      chunk: PropTypes.array.isRequired
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.chunkSize !== this.props.chunkSize;
  }

  render () {
    return (
      <RowWrapper className='row-img' style={this.props.style}>
        {this.props.chunk.map((i) => {
          return (
            <CatalogPoster
              key={i._id || uid.generate()} id={i._id}
              title={i.title} rating={i.rating} year={i.year}
              // image={gatewayHelper.parsePosterUri(i.resource, 'medium')}
              image={i.image}
              {...this.props}
            />
          )
        })}
        {
            (this.props.chunk.length < this.props.chunkSize) &&
            Array(this.props.chunkSize - this.props.chunk.length).fill(0).map(() => {
              return <CatalogPoster key={uid.generate()} end={this.props.end} empty />
            })
        }
      </RowWrapper>
    )
  }
}

export const RowWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '1rem',
  paddingRight: '1rem'
}))
