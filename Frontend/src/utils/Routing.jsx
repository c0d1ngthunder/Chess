import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Game from "../components/Game";

const Routing = () => {
  return <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Game" element={<Game />} />
  </Routes>;
};

export default Routing;
