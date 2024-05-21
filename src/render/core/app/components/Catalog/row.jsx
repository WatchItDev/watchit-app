import React from 'react'
import uid from 'shortid'
import PropTypes from 'prop-types'
import gatewayHelper from '@helpers/gateway'
import { Box, styled } from '@mui/material'
import { Poster } from '@watchitapp/watchitapp-uix'

export default class CatalogRow extends React.Component {
  static get propTypes () {
    return {
      chunk: PropTypes.array.isRequired
    }
  }

  shouldComponentUpdate(nextProps) {
    // console.log('is diferent cid?')
    // console.log(nextProps.cid)
    // console.log(this.props.cid)
    // console.log((nextProps.cid !== this.props.cid))
    return (nextProps.chunkSize !== this.props.chunkSize) || (nextProps.chunk.length !== this.props.chunk.length) || (nextProps.end !== this.props.end) || (nextProps.cid !== this.props.cid);
  }

  render () {
    return (
      <RowWrapper className='row-img' style={this.props.style}>
        {this.props.chunk.map((i) => {
          return (
              <Poster
                  key={i.id || uid.generate()}
                  img={gatewayHelper.dummyParse(i.images?.['medium'] ?? '')}
                  onClick={() => { this.props.onClick(i) }}
                  title={i.meta?.title}
                  rate={i.meta?.rating}
                  end={this.props.end}
                  year={i.meta?.year} canHover={true}
              />
          )
        })}
        {
            (this.props.chunk.length < this.props.chunkSize) &&
            Array(this.props.chunkSize - this.props.chunk.length).fill(0).map(() => {
              return <Poster
                  key={uid.generate()}
                  img={'https://i0.wp.com/www.themoviedb.org/t/p/w185/ncKCQVXgk4BcQV6XbvesgZ2zLvZ.jpg'}
                  title={''}
                  end={this.props.end} empty
              />
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
