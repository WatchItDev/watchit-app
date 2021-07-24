import React from 'react'
import styled from 'styled-components'
import Logo from 'components/app-logo/'
import setting from 'settings'

export const BackgroundWrapper = styled.div`
  height: ${props => props.absolute ? '100%' : 'auto'};
  width: ${props => props.absolute ? '100%' : 'auto'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: ${props => props.absolute ? 'absolute' : 'relative'};
  left: 0;
  top: 0;
  margin-bottom: -3rem;

  @media ${setting.styles.devices.desktop} {
    margin-bottom: 0;
  }
`

export const Slogan = styled.div`
  color: white;
  transform: translateY(-3rem);
  letter-spacing: 2px;
  font-size: 2rem;
  display: ${({ show }) => show ? 'inline-block' : 'none'};

  @media ${setting.styles.devices.laptopAndLow} {
    font-size: 1.5rem !important;
  }
  
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
