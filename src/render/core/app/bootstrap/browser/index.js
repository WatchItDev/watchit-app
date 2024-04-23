import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BrowseDesktop from '@pages/BrowseDesktop'
import PlayerUIX from '@pages/PlayUIX'

export default (/* hist, key */) => {
  return (
    <BrowserRouter /* history={hist} */>
      <Routes>
        <Route
          path='/'
          name='browse'
          render={() => <BrowseDesktop/>}
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
