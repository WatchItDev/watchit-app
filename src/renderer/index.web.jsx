// eslint-disable-next-line
// import './wdyr';

import React from "react";
import ReactDOM from "react-dom/client";

import DB from '@/main/core/db'
import Bootstrap from "@/main/core/bootstrap";
import webRenderer from "@/main/core/broker/fallback";
import Helia from "@/main/core/helia";

import App from "./package/runtime/browser";
import { ContextProvider } from "./package/runtime/context";

import 'normalize.css'
import './index.web.scss'

// Initialize nodes and core libs
// this initialization persist over the underlying ipc
const bridge = { db: DB(), broker: webRenderer }
await Bootstrap(webRenderer, { Helia, runtime: "web" });
ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider value={bridge}>
        <App />
    </ContextProvider>
)

