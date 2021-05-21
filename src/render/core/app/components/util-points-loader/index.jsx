import React from 'react'
import Dots from 'render/media/img/spinner/three-dots.svg'
import styled from "styled-components";

export default class PointsLoader extends React.Component {
    render() {
        return (
            <Loader alt="Loader" src={Dots}/>
        )
    }
}

const Loader = styled.img`
  height: 0.8rem;
`;
