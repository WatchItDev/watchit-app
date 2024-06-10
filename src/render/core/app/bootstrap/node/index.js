// Require logged
import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import DragBar from "@components/DragBar";
import Home from "@pages/Home";

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
      </Routes>
    </HashRouter>
  );
};
