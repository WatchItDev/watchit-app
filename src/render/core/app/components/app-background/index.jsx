import React from 'react'
import styled from 'styled-components'
import Logo from 'components/app-logo/'
import setting from 'settings'

const BackgroundWrapper = styled.div`
  height: ${props => props.absolute ? '100%' : 'auto'};
  width: ${props => props.absolute ? '100%' : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.absolute ? 'absolute' : 'relative'}
  left: 0;
  top: 0;
`

const Slogan = styled.div`
  position: absolute;
  color: white;
  transform: translateY(-3rem);
  letter-spacing: 2px;
  font-size: 2rem;
  display: ${({ show }) => show ? 'inline-block' : 'none'};

  @media ${setting.styles.devices.desktop} {
    font-size: 3rem;
    transform: translateY(-1rem);
  }
`

const Background = (props) => {
  return (
    <BackgroundWrapper absolute={props.absolute}>
      <Logo show={props.showLogo} thumbnail={false} absolute={props.absolute} />
      <Slogan show={props.showLogo}>open movies everywhere</Slogan>
    </BackgroundWrapper>
  )
}

Background.defaultProps = {
  showLogo: true,
  absolute: true
}

export default React.memo(Background)
