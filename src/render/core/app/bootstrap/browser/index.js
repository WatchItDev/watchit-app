import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Browse from "@pages/Browse";

export default (/* hist, key */) => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route name="browse" path="/" element={<Browse />} />
      </Routes>
    </HashRouter>
  );
};
