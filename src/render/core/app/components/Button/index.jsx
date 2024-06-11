import React from 'react'
import PointsLoader from '@components/PointsLoader'
import styled from 'styled-components'

export default class Button extends React.Component {

  constructor(props = {
    clicked: false,
    type: 'button'
  }) {
    super(props)
  }


  render() {
    return (
      <ButtonWrapper type={this.props.type} onClick={this.props.onClick}>
        {
          /* show loader on submit */
          ((Object.is(this.props.type, 'submit') || this.props.forceLoader) &&
            this.props.clicked && <PointsLoader />) || this.props.children
        }
      </ButtonWrapper>
    )
  }
}

const ButtonWrapper = styled.button`
  width: 100%;
  text-decoration: none;
  color: #fff;
  background-color: #26a69a;
  text-align: center;
  letter-spacing: .5px;
  border: none;
  border-radius: 2px;
  height: 36px;
  cursor: pointer;
  line-height: 36px;
  position: relative;
`
