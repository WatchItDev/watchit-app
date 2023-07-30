import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '@pages/Login'
import Catalog from '@pages/Home'
import Player from '@pages/Player'
import React from 'react'
import ChannelManageDesktop from '../../pages/ChannelManageDesktop'
import BrowseDestop from '../../pages/BrowseDestop'
import PlayerUIX from '../../pages/PlayUIX'

export default (hist, key) => {
  return (
    <HashRouter history={hist}>
      <Switch>
        <Route
          name='login' exact path='/'
          render={(n) => !key.isLogged()
            ? <Login/>
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
        <Route
          name='channels'
          path='/channels'
          render={() => <ChannelManageDesktop/>}
        />
        <Route
          name='browse'
          path='/browse'
          render={() => <BrowseDestop/>}
        />
        <Route
          name='player'
          path='/player'
          render={() => <PlayerUIX/>}
        />
      </Switch>
    </HashRouter>
  )
}
