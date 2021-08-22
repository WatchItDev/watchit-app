import React from 'react'
import styled from 'styled-components'

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

  @media only screen and (min-width: 360px) {
    font-size: 1.2rem;
  }
  @media only screen and (min-width: 390px) {
    font-size: 1.224rem;
  }
  @media only screen and (min-width: 420px) {
    font-size: 1.248rem;
  }
  @media only screen and (min-width: 450px) {
    font-size: 1.272rem;
  }
  @media only screen and (min-width: 480px) {
    font-size: 1.296rem;
  }
  @media only screen and (min-width: 510px) {
    font-size: 1.32rem;
  }
  @media only screen and (min-width: 540px) {
    font-size: 1.344rem;
  }
  @media only screen and (min-width: 570px) {
    font-size: 1.368rem;
  }
  @media only screen and (min-width: 600px) {
    font-size: 1.392rem;
  }
  @media only screen and (min-width: 630px) {
    font-size: 1.416rem;
  }
  @media only screen and (min-width: 660px) {
    font-size: 1.44rem;
  }
  @media only screen and (min-width: 690px) {
    font-size: 1.464rem;
  }
  @media only screen and (min-width: 720px) {
    font-size: 1.488rem;
  }
  @media only screen and (min-width: 750px) {
    font-size: 1.512rem;
  }
  @media only screen and (min-width: 780px) {
    font-size: 1.536rem;
  }
  @media only screen and (min-width: 810px) {
    font-size: 1.56rem;
  }
  @media only screen and (min-width: 840px) {
    font-size: 1.584rem;
  }
  @media only screen and (min-width: 870px) {
    font-size: 1.608rem;
  }
  @media only screen and (min-width: 900px) {
    font-size: 1.632rem;
  }
  @media only screen and (min-width: 930px) {
    font-size: 1.656rem;
  }
  @media only screen and (min-width: 960px) {
    font-size: 1.8rem;
  }
  @media only screen and (max-width: 360px) {
    font-size: 1.2rem;
  }
`
