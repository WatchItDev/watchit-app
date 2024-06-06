// Require logged
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import DragBar from "@components/DragBar";
import Home from "@pages/Home";
import PlayerUIX from "@pages/PlayUIX";

export default () => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route
          name="home"
          path="/"
          element={
            <DragBar>
              <Home />
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
