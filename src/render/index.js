import React from 'react';
import ReactDOM from 'react-dom';
import Login from 'pages/login-view/index';
import MovieIndex from 'pages/index-view';
import MoviePlayer from 'pages/player-view';
import DragBar from 'components/app-drag-bar/index'

import 'normalize.css'
import './index.sass';
import 'plyr/dist/plyr.css';

import {createBrowserHistory} from 'history';
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";

const key = window.bridge.Key
const hist = createBrowserHistory({
    basename: "/", // The base URL of the app (see below)
    forceRefresh: false, // Set true to force full page refreshes
    hashType: 'slash'
});


//Require logged
function DragBarHOC(Component, navigate) {
    return <DragBar>
        <Component {...navigate}/>
    </DragBar>
}

ReactDOM.render(
    <HashRouter history={hist}>
        <Switch>
            <Route name="login" exact path="/"
                   render={(n) => !key.isLogged()
                       ? DragBarHOC(Login, n) : (<Redirect to="/app/movies"/>)}/>
            <Route name="movies" exact path="/app/movies"
                   render={(n) => (DragBarHOC(MovieIndex, n))}/>
            <Route name="player"
                   path="/play/:resource"
                   render={(n) => (DragBarHOC(MoviePlayer, n))}/>
        </Switch>
    </HashRouter>,
    document.getElementById('root')
);

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
