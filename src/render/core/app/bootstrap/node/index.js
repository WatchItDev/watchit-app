//Require logged
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import DragBar from "components/app-drag-bar";
import Login from "pages/login-view";
import MovieIndex from "pages/index-view";
import MoviePlayer from "pages/player-view";
import React from "react";

function DragBarHOC(Component, navigate) {
    return <DragBar>
        <Component {...navigate}/>
    </DragBar>
}

export default (hist, key) => {
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