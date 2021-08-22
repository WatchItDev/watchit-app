import React from 'react'
import styled from 'styled-components'
import settings from '@settings'

const FlowText = (props) => {
  return (
    <FlowTextWrappper {...props}>
      {props.children}
    </FlowTextWrappper>
  )
}

export default React.memo(FlowText)

const FlowTextWrappper = styled.span`
  color: ${(props) => props.color || '#9e9e9e'};
  
  @media ${settings.styles.devices.mobileS} {
    font-size: 1.2rem;
  }
  @media ${settings.styles.devices.mobileM} {
    font-size: 1.24rem;
  }
  @media ${settings.styles.devices.mobileL} {
    font-size: 1.248rem;
  }
  
  @media ${settings.styles.devices.tablet} {
    font-size: 1.536rem;
  }
  
  @media ${settings.styles.devices.laptop} {
    font-size: 1.8rem;
  }
  
`
