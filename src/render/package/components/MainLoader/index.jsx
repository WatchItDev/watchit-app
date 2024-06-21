import React from 'react'
import Lottie from 'lottie-react'
import {Typography} from "@mui/material";

import BarLoader from "@/render/package/components/BarLoader";
import loaderAnimation from '@/render/media/img/watchit_logo.json'

export default class MainLoader extends React.Component {
  shouldComponentUpdate (nextProps) {
    return !Object.is(nextProps?.percent, this.props.percent) || !Object.is(nextProps.content, this.props.content)
  }

  render () {
    return (
      <div className='absolute full-height full-width loading-box has-main-background valign-wrapper'>
        {this.props.percent ? (
            <div className='main-loader-bar'>
              <BarLoader statePercent={this.props.percent} />
            </div>
        ) : <></>}
        <div className='center-block valign'>
          <div className='main-loader-content'>
            <Lottie animationData={loaderAnimation} loop autoPlay style={{width: 200, height: 200}} />
            {this.props.content ? (
                <Typography variant="h5" color={'#D1D2D3'} sx={{ marginTop: -5 }}>
                  {this.props.content}
                </Typography>
            ) : <></>}
          </div>
        </div>
      </div>
    )
  }
}
