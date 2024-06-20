import './wdyr';
import React from "react";
import { Helia } from "@main/core/helia.mjs";
import { createRoot } from "react-dom/client";
import { Broker } from "@main/bridge";
import * as Bootstrap from "@main/core";
import App from "./core/app";
import { GlobalStylesWeb } from "./globalStyles.web";

const webRenderer = Broker.getIPC();
// Initialize nodes and core libs
// this initialization persist over the underlying ipc
await Bootstrap(webRenderer, { Helia, runtime: "web" });
const root = createRoot(document.getElementById("root"));
root.render(
    <>
        <App />
        <GlobalStylesWeb />
    </>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// registerServiceWorker()
