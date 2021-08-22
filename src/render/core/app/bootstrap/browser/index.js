import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '@pages/Login'
import Catalog from '@pages/Home'
import Player from '@pages/Player'
import React from 'react'

export default (hist, key) => {
  return (
    <HashRouter history={hist}>
      <Switch>
        <Route
          name='login' exact path='/'
          render={(n) => !key.isLogged()
            ? <Login {...n} />
            : (<Redirect to='/app/movies' />)}
        />
        <Route
          name='movies' exact path='/app/movies'
          render={(n) => <Catalog {...n} />}
        />
        <Route
          name='player'
          path='/play/:resource'
          render={(n) => <Player {...n} />}
        />
      </Switch>
    </HashRouter>
  )
}
