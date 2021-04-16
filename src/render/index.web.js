import 'main/preload'
import Bootstrap from 'main/core'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './core/app/index'

import 'normalize.css'
import './index.sass';
import 'plyr/dist/plyr.css';
import * as serviceWorker from './serviceWorker';

const webRenderer = window.bridge.Broker.getIPC()
Bootstrap(webRenderer, 'web') // Initialize nodes and core libs

const root = document.getElementById('root')
ReactDOM.render(<App/>, root);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();


