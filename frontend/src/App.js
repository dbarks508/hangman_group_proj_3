import React from "react";
import { Route, Routes } from "react-router-dom";

import Hangman from "./components/hangman.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hangman />} />
      </Routes>
    </div>
  );
};

export default App;
