// eslint-disable-next-line
import React from "react";
import { Helia } from "@main/core/helia.mjs";

import ReactDOM from "react-dom";
import App from "./core/app/index";

import { Broker as broker } from "@main/bridge";
import * as Bootstrap from "@main/core";

console.log(broker)

const webRenderer = broker.getIPC();
// Initialize nodes and core libs
// this initialization persist over the underlying ipc
Bootstrap(webRenderer, { Helia });

const root = document.getElementById("root");
ReactDOM.render(<App />, root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// registerServiceWorker()
