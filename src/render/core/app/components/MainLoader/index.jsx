import React from 'react'
import Lottie from 'lottie-react'
import loaderAnimation from '@render/media/img/watchit_logo.json'
import {Typography} from "@mui/material";
import BarLoader from "@components/BarLoader";

export default class MainLoader extends React.Component {
  shouldComponentUpdate (nextProps, nextState, nextContext) {
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
                <Typography variant="h5" gutterBottom sx={{ marginTop: 2 }}>
                  {this.props.content}
                </Typography>
            ) : <></>}
          </div>
        </div>
      </div>
    )
  }
}
