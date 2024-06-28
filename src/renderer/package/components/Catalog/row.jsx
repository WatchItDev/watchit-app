// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import {Box, styled} from '@mui/material';

// THIRD PARTY IMPORTS
import uid from 'shortid'
import PropTypes from 'prop-types'

// LOCAL IMPORTS
import CatalogPoster from '@/renderer/package/components/Poster'
import gateway from '@/renderer/gateway'

// ----------------------------------------------------------------------
// MAIN COMPONENT

export default class CatalogRow extends React.Component {
  static get propTypes () {
    return {
      chunk: PropTypes.array.isRequired
    }
  }
  
  shouldComponentUpdate(nextProps) {
    return nextProps.chunk !== this.props.chunk || nextProps.chunkSize != this.props.chunkSize
  }

  render() {
    return (
        <RowWrapper style={this.props.style}>
          {!this.props.empty &&
              this.props.chunk.map((i) => {
                return (
                    <CatalogPoster
                        key={i._id || uid.generate()}
                        id={i._id}
                        image={gateway.parse(i?.images?.medium)}
                        {...this.props}
                        {...i}
                    />
                );
              })}
          {this.props.chunk.length < this.props.chunkSize &&
              !this.props.empty &&
              Array(this.props.chunkSize - this.props.chunk.length)
                  .fill(0)
                  .map(() => {
                    return <CatalogPoster key={uid.generate()} {...this.props} empty />;
                  })}
        </RowWrapper>
    );
  }
}

// ----------------------------------------------------------------------
// SUB COMPONENTS

const RowWrapper = styled(Box)(() => ({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '1rem',
    paddingRight: '1rem'
}));