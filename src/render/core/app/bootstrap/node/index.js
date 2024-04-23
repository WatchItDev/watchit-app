// Require logged
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import DragBar from "@components/DragBar";
import BrowserDesktop from "@pages/BrowserDesktop";
import PlayerUIX from "@pages/PlayUIX";

export default () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route
          name="browse"
          path="/"
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
