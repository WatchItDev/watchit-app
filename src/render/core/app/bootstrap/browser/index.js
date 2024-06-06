import React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "@pages/Home";

export default (/* hist, key */) => {
  return (
    <HashRouter basename="/">
      <Routes>
        <Route name="home" path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};
