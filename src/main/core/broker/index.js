const Broker = require("./broker");
const renderer = require(process.env.RUNTIME === "web"
  ? "./browser"
  : "./node");

// Construct broker with renderer
module.exports = function BrokerFactory() {
  return new Broker(
    renderer // WebIPC || Electron.MainIPC
  );
};
