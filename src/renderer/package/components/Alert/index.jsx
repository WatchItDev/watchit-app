import styled from 'styled-components'
import settings from '@/renderer/settings'

const Alert = styled.div`
  padding: 7px 10px;
  border-radius: 3px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  background-color: ${props => props?.color ?? settings.styles.colors.default};
`

export default Alert
