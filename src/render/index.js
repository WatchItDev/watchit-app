import React from 'react';
import ReactDOM from 'react-dom';
import App from './core/app'

import 'normalize.css'
import './index.sass';
import 'plyr/dist/plyr.css';

// import * as serviceWorker from './serviceWorker';

const root = document.getElementById('root')
ReactDOM.render(<App/>, root);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();

//LISTENERS
const preventDefault = (e) => e.preventDefault()
// Prevent dropping files into the window
window.addEventListener("dragover", preventDefault, false);
window.addEventListener("drop", preventDefault, false);
// Prevent dragging files outside the window
window.addEventListener("dragstart", preventDefault, false);
//Avoid right click
document.addEventListener('contextmenu', preventDefault, false);
//Prevent default reload, devtools
document.addEventListener('keydown', (e) => {
    let keyCode = !window.event ? (e.which || e.keyCode) : window.event.keyCode;
    let avoidReload = (e.ctrlKey && keyCode === 82 && process.env.NODE_ENV !== 'development')
    // this code handles the F5/Ctrl+F5/Ctrl+R
    if (keyCode === 116 || avoidReload)
        e.preventDefault();
    if (keyCode === 122 || keyCode === 123)
        e.preventDefault()

});
