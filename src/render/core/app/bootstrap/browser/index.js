import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BrowserDesktop from "@pages/BrowserDesktop";
import PlayerUIX from '@pages/PlayUIX'

export default (/* hist, key */) => {
  return (
    <BrowserRouter /* history={hist} */>
      <Routes>
        <Route
          path='/'
          name='browse'
          render={() => <BrowserDesktop/>}
        />
        <Route
          name='player'
          path='/player'
          render={() => <PlayerUIX/>}
        />
      </Routes>
    </BrowserRouter>
  )
}
