// Require logged
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import DragBar from '@components/DragBar'
import Login from '@pages/Login'
import Catalog from '@pages/Home'
import Player from '@pages/Player'
import React from 'react'

function DragBarHOC (Component, navigate) {
  return (
    <DragBar>
      <Component {...navigate} />
    </DragBar>
  )
}

export default (hist, key) => {
  return (
    <HashRouter history={hist}>
      <Switch>
        <Route
          name='login' exact path='/'
          render={(n) => !key.isLogged()
            ? Login
            : (<Redirect to='/app/movies' />)}
        />
        <Route
          name='movies' exact path='/app/movies'
          render={(n) => (DragBarHOC(Catalog, n))}
        />
        <Route
          name='player'
          path='/play/:resource'
          render={(n) => (DragBarHOC(Player, n))}
        />
      </Switch>
    </HashRouter>
  )
}
