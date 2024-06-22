import Broker from './broker'

// Construct broker with renderer
export default function BrokerFactory (renderer) {
  return new Broker(
    renderer
  )
}
