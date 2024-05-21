import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import BrowserDesktop from "@pages/BrowserDesktop";
import PlayerUIX from "@pages/PlayUIX";

export default (/* hist, key */) => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route name="browse" path="/" element={<BrowserDesktop />} />
        <Route name="player" path="/player" element={<PlayerUIX />} />
      </Routes>
    </HashRouter>
  );
};
