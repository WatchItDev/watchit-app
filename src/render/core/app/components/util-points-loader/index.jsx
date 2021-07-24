import React from 'react'
import styled from 'styled-components'
import Dots from '@render/media/img/spinner/three-dots.svg'

const PointsLoader = styled.img`
  height: 0.8rem;
`

PointsLoader.defaultProps = { src: Dots }
export default React.memo(PointsLoader)
