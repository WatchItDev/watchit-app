import React from 'react'
import Dots from 'render/media/img/spinner/three-dots.svg'
import styled from "styled-components";

const PointsLoader = styled.img`
  height: 0.8rem;
`;

PointsLoader.defaultProps = {
    src: Dots
}

export default PointsLoader;