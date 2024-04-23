// Require logged
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import DragBar from "@components/DragBar";
import ChannelManageDesktop from "@pages/ChannelManageDesktop";
import BrowserDesktop from "@pages/BrowserDesktop";
import PlayerUIX from "@pages/PlayUIX";

export default () => {
  return (
    <HashRouter basename="/">
      <Routes>
        {/* <Route
          name="login"
          path="/"
          render={() => <BrowseDesktop />}
          // render={(n) => !key.isLogged()
          //   ? Login
          //   : (<Redirect to='/app/movies' />)}
        /> */}
        <Route
          path="/"
          name="channels"
          element={
            <DragBar>
              <ChannelManageDesktop />
            </DragBar>
          }
        />
        <Route
          name="browse"
          path="/browse"
          element={
            <DragBar>
              <BrowserDesktop />
            </DragBar>
          }
        />
        <Route
          name="player"
          path="/player"
          element={
            <DragBar>
              <PlayerUIX />
            </DragBar>
          }
        />
      </Routes>
    </HashRouter>
  );
};
