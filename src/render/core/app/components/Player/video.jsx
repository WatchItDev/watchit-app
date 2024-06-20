import React from 'react'
import { styled } from '@mui/material';

const Video = styled('video')({
  outline: 'none !important',
  width: '100%',
  height: '100%'
});

export default class PlayerVideo extends React.PureComponent {
  constructor(props = { type: '' }) {
    super(props)
    this.video = null
  }

  getRef = (node) => {
    this.video = node
  }

  render() {
    return (
      <Video
          ref={this.getRef}
          autoPlay
          controls
          playsInline
          className="vjs-theme-city video-js"
      />
    )
  }
}
