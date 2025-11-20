import React from "react";
import { Route, Routes } from "react-router-dom";

import Hangman from "./components/hangman.js";
import Welcome from "./components/welcome.js";
import Waiting from "./components/waiting.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/hangman" element={<Hangman />} />
        <Route path="/" element={<Welcome />} />
        <Route path="/waiting" element={<Waiting />} />
      </Routes>
    </div>
  );
};

export default App;
