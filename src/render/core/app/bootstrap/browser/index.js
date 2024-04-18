import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChannelManageDesktop from '@pages/ChannelManageDesktop'
// import BrowseDesktop from '@pages/BrowseDesktop'
// import PlayerUIX from '@pages/PlayUIX'

export default (/* hist, key */) => {
  return (
    <BrowserRouter /* history={hist} */>
      <Routes>
        <Route
          name='channels'
          path='/'
          render={() => <ChannelManageDesktop/>}
        />
        {/* <Route
          name='browse'
          path='/browse'
          render={() => <BrowseDesktop/>}
        />
        <Route
          name='player'
          path='/player'
          render={() => <PlayerUIX/>}
        /> */}
      </Routes>
    </BrowserRouter>
  )
}
