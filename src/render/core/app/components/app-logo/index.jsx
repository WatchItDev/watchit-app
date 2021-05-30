import React from 'react'
import setting from 'settings'
import icon from 'render/media/icons/icon.png'
import styled, { keyframes } from 'styled-components'

const LogoWrapper = styled.h5`
  position: ${props => props.absolute ? 'absolute' : 'relative'};
  transform: ${props => !props.thumbnail ? 'scale(3) translateY(-2.7rem)' : 'scale(1)'};
  letter-spacing: 2px;
  font-family: "Oswald", Arial, sans-serif;
  display: ${props => props.show ? 'inline-block' : 'none'};
  margin: 0;
  @media ${setting.styles.devices.mobileS} {
    font-size: 1.5rem !important;
  }

  @media ${setting.styles.devices.laptop} {
    font-size: 2rem !important;
  }

  @media ${setting.styles.devices.desktop} {
    font-size: 3rem !important;
  }
`

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  margin-right: -3px;

  @media ${setting.styles.devices.mobileS} {
    width: 40px;
    height: 40px;
  }

  @media ${setting.styles.devices.laptop} {
    width: 50px;
    height: 50px;
  }

  @media ${setting.styles.devices.desktop} {
    width: 70px;
    height: 70px;
  }
`

const LogoText = styled.span`
  position: relative;
  color: #fff;
  top: -9px;
  font-weight: 600;

  @media ${setting.styles.devices.desktop} {
    top: -12px;
  }
`

const Colors = keyframes`
  0% {
    color: rgb(251, 211, 1);
  }
  25% {
    color: rgb(255, 50, 112);
  }
  50% {
    color: rgb(32, 139, 241);
  }
  75% {
    color: rgb(175, 225, 2);
  }
  100% {
    color: rgb(251, 211, 1);
  }
`

const LogoColoredText = styled.span`
  font-weight: bold;
  position: relative;
  top: -9px;
  animation: ${Colors} 4.6s ease infinite;

  @media ${setting.styles.devices.desktop} {
    top: -12px;
  }
`

const Logo = (props) => {
  return (
    <LogoWrapper show={props.show} absolute={props.absolute} thumbnail={props.thumbnail}>
      <LogoImg src={icon} alt='Logo' width={50} height={50} />
      <LogoText>ATCH</LogoText>
      <LogoColoredText>IT</LogoColoredText>
    </LogoWrapper>
  )
}

// Set default props
Logo.defaultProps = {
  show: true,
  absolute: false,
  thumbnail: true
}

export default React.memo(Logo)
