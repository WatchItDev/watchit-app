import React from 'react';
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import DragBar from 'components/app-drag-bar/index'
import {createBrowserHistory} from 'history';
import Login from 'pages/login-view/index';
import MovieIndex from 'pages/index-view';
import MoviePlayer from 'pages/player-view';

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

export default () => {
    return <HashRouter history={hist}>
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
    </HashRouter>
}