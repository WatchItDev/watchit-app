import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import Login from "pages/login-view";
import MovieIndex from "pages/index-view";
import MoviePlayer from "pages/player-view";
import React from "react";

export default (hist, key) => {
    return <HashRouter history={hist}>
        <Switch>
            <Route name="login" exact path="/"
                   render={(n) => !key.isLogged()
                       ? <Login {...n}/> : (<Redirect to="/app/movies"/>)}/>
            <Route name="movies" exact path="/app/movies"
                   render={(n) => <MovieIndex {...n}/>}/>
            <Route name="player"
                   path="/play/:resource"
                   render={(n) => <MoviePlayer {...n}/>}/>
        </Switch>
    </HashRouter>
}