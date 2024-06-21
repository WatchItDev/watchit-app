import Broker from "./broker";
import renderer from './browser'

// Construct broker with renderer
export default function BrokerFactory() {
  return new Broker(
    renderer
  );
};
