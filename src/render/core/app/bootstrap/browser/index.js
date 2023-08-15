import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '@pages/Login'
import Catalog from '@pages/Home'
import Player from '@pages/Player'
import React from 'react'
import Channels from '../../pages/Channels'
import Browse from '../../pages/Browse'
import PlayerUIX from '../../pages/PlayUIX'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { defaultTheme } from '../../styles/theme'
import CssBaseline from '@mui/material/CssBaseline'

export default (hist, key) => {
  const theme = responsiveFontSizes(createTheme(defaultTheme))
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter history={hist}>
        <Switch>
          <Route
            name='login' exact path='/'
            render={(n) => !key.isLogged()
              ? <Login />
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
            render={() => <Channels />}
          />
          <Route
            name='browse'
            path='/browse'
            render={() => <Browse />}
          />
          <Route
            name='player_uix'
            path='/player'
            render={() => <PlayerUIX />}
          />
        </Switch>
      </HashRouter>
    </ThemeProvider>
  )
}
