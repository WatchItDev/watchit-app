import React from 'react'
import Lottie from 'lottie-react'
import { Typography, Box } from '@mui/material';

import BarLoader from "@/renderer/package/components/BarLoader";
import loaderAnimation from '@/renderer/media/img/watchit_logo.json'

export default class MainLoader extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
        !Object.is(nextProps?.percent, this.props.percent) ||
        !Object.is(nextProps.content, this.props.content)
    );
  }

  render() {
    return (
        <LoadingBox>
          {this.props.percent ? (
              <MainLoaderBar>
                <BarLoader statePercent={this.props.percent} />
              </MainLoaderBar>
          ) : null}
          <CenterBlock>
            <MainLoaderContent>
              <Lottie animationData={loaderAnimation} loop autoPlay style={{ width: 200, height: 200 }} />
              {this.props.content ? (
                  <Typography variant="h5" color="#D1D2D3" sx={{ marginTop: -5 }}>
                    {this.props.content}
                  </Typography>
              ) : null}
            </MainLoaderContent>
          </CenterBlock>
        </LoadingBox>
    );
  }
}

// Styled Components
const LoadingBox = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1000,
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#212328',
});

const MainLoaderBar = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1001,
  height: '1px',
  width: '100%'
});

const CenterBlock = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
});

const MainLoaderContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
});
