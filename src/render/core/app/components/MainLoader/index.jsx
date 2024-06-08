import React from 'react'
import Lottie from 'lottie-react'
import loaderAnimation from '@render/media/img/watchit_logo.json'

export default class MainLoader extends React.Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <div className='absolute full-height full-width loading-box has-main-background valign-wrapper'>
        <div className='center-block valign'>
          <div className='z-index-middle'>
            <Lottie animationData={loaderAnimation} loop autoPlay style={{width: 200, height: 200}} />
          </div>
        </div>
      </div>
    )
  }
}
