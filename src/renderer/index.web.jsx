// eslint-disable-next-line
// import './wdyr';

import React from "react";
import ReactDOM from "react-dom/client";

import DB from '@/main/core/db'
import Bootstrap from "@/main/core";
import Broker from "@/main/core/broker";
import IPC from "@/main/core/broker/fallback";
import { Helia } from "@/main/core/helia.mjs";

import App from "./package/runtime/browser";
import { ContextProvider } from "./package/runtime/context";

import 'normalize.css'
import './index.web.scss'

const db = DB();
const broker = Broker(IPC)
const webRenderer = broker.getIPC();
// Initialize nodes and core libs
// this initialization persist over the underlying ipc
await Bootstrap(webRenderer, { Helia, runtime: "web" });
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ContextProvider value={{ broker, db }}>
            <App />
        </ContextProvider>
    </React.StrictMode>,
)

