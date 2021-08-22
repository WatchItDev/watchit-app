import React from 'react'
import setting from '@settings'
import icon from '@render/media/icons/icon.png'
import styled, { keyframes } from 'styled-components'

export const LogoWrapper = styled.h5`
  position: relative;
  transform: ${props => !props.thumbnail ? 'scale(3) translateY(-1.8rem)' : 'scale(1)'};
  letter-spacing: 2px;
  font-family: "Oswald", Arial, sans-serif;
  display: ${props => props.show ? 'flex' : 'none'};
  margin: 0;
  align-items: flex-end;

  @media ${setting.styles.devices.mobileS} {
    font-size: 1.5rem !important;
    line-height: 1.5rem !important;
  }

  @media ${setting.styles.devices.laptop} {
    font-size: 2rem !important;
    line-height: 1.9rem !important;
  }

  @media ${setting.styles.devices.desktop} {
    font-size: 3rem !important;
    line-height: 2.8rem !important;
    transform: ${props => !props.thumbnail ? 'scale(3) translateY(-1.5rem)' : 'scale(0.8) translateX(-1.5rem)'};
  }
`

const LogoImg = styled.img`
  width: 50px;
  height: 35px;
  margin-right: -3px;

  @media ${setting.styles.devices.mobileS} {
    width: 40px;
    height: 30px;
  }

  @media ${setting.styles.devices.laptop} {
    width: 50px;
    height: 35px;
  }

  @media ${setting.styles.devices.desktop} {
    width: 70px;
    height: 50px;
  }
`

const LogoText = styled.span`
  position: relative;
  color: #fff;
  display: inline-block;
  font-weight: 600;
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
  display: inline-block;
  animation: ${Colors} 4.6s ease infinite;
`

const Logo = (props) => {
  return (
    <LogoWrapper show={props.show} thumbnail={props.thumbnail}>
      <LogoImg src={icon} alt='Logo' width={50} height={50} />
      <LogoText thumbnail={props.thumbnail}>ATCH</LogoText>
      <LogoColoredText thumbnail={props.thumbnail}>IT</LogoColoredText>
    </LogoWrapper>
  )
}

// Set default props
Logo.defaultProps = {
  show: true,
  thumbnail: true
}

export default React.memo(Logo)
