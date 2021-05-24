//Require logged
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import MainHeader from "components/app-main-header";
import Login from "pages/login-view";
import MovieIndex from "pages/index-view";
import MoviePlayer from "pages/player-view";
import React from "react";

function MainHeaderHOC(Component, navigate) {
    return <MainHeader>
        <Component {...navigate}/>
    </MainHeader>
}

export default (hist, key) => {
    return <HashRouter history={hist}>
        <Switch>
            <Route name="login" exact path="/"
                   render={(n) => !key.isLogged()
                       ? MainHeaderHOC(Login, n) : (<Redirect to="/app/movies"/>)}/>
            <Route name="movies" exact path="/app/movies"
                   render={(n) => (MainHeaderHOC(MovieIndex, n))}/>
            <Route name="player"
                   path="/play/:resource"
                   render={(n) => (MainHeaderHOC(MoviePlayer, n))}/>
        </Switch>
    </HashRouter>
}