import styled from 'styled-components'
import settings from 'settings'

const Alert = styled.div`
  padding: 7px 10px;
  border-radius: 3px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  background-color: ${props => props.color};
`

Alert.defaultProps = { color: settings.styles.colors.default }
export default Alert
