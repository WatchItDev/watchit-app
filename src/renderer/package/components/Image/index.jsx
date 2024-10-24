// REACT IMPORTS
import React from 'react'

// MUI IMPORTS
import { Box, styled } from '@mui/material'

// THIRD PARTY IMPORTS
import PropTypes from 'prop-types'

// LOCAL IMPORTS
import PulseLoader from '@/renderer/package/components/PulseLoader'
import log from '@/main/logger'

// ----------------------------------------------------------------------
// MAIN COMPONENT

class Image extends React.PureComponent {
  constructor(props = { preload: false, pulseStyle: null }) {
    super(props);
    this.img = React.createRef();
    this.state = {
      loaded: false
    }
  }

  static get propTypes() {
    return {
      src: PropTypes.string.isRequired
    }
  }

  handleImageLoaded = () => {
    setTimeout(() => this.setState({
      loaded: true
    }), 0)
  }

  componentDidMount() {
    const img = this.img?.current
    if (img && img.complete) {
      this.handleImageLoaded()
    }
  }

  componentWillUnmount() {
    if (this.img.current) {
      this.img.current.src = ''; // Abort
    }
  }

  handleImageError = () => {
    log.warn('Fail image request')
    log.warn('Retrying...')
    this.setState({ loaded: false }, () => {
      this.forceUpdate()
    })
  }

  render() {
    return (
        <ImageContainer>
          {!this.state.loaded && this.props.preload && <PulseLoader style={this.props.pulseStyle} />}
          <StyledImage
              alt=""
              src={this.props.src}
              onLoad={this.handleImageLoaded}
              loading="lazy"
              onError={this.handleImageError}
              ref={this.img}
              className={this.state.loaded || !this.props.preload ? 'loaded-img' : 'locked-img'}
          />
        </ImageContainer>
    );
  }
}

// ----------------------------------------------------------------------
// SUB COMPONENTS

const ImageContainer = styled(Box)({
  width: '100%',
  height: 'auto',
  display: 'inline-block',
  flexShrink: 0,
  position: 'relative',
});

const StyledImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  height: 'auto',
  width: '100%',
  position: 'relative',
  transition: 'opacity 1.5s ease-in-out',
  '&.locked-img': {
    opacity: 0,
  },
  '&.loaded-img': {
    opacity: 1,
    borderRadius: '0.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    '&.image-container': {
      width: '10rem',
    },
  },
}));

// ----------------------------------------------------------------------

export default React.memo(Image);
