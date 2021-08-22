import styled from 'styled-components'

const ProgressBar = styled.div`
  position: relative;
  height: 2px;
  width: ${props => props.percentage}%;
  background-color: #26a69a;
  transition: all 0.2s ease-in-out;
`

export default ProgressBar
