// eslint-disable-next-line
// import './wdyr';

import React from "react";
import ReactDOM from "react-dom/client";

import Bootstrap from "@/main/core";
import { Helia } from "@/main/core/helia.mjs";
import { Broker } from "@/main/bridge";

import App from "./package/bootstrap/browser";
import 'normalize.css'
import './index.web.scss'

const webRenderer = Broker.getIPC();
// Initialize nodes and core libs
// this initialization persist over the underlying ipc
await Bootstrap(webRenderer, { Helia, runtime: "web" });
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

