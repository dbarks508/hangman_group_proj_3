import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Hangman() {
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    guess: "",
  });

  function updateForm(jsonObj) {
    return setForm((prevJsonObj) => {
      return { ...prevJsonObj, ...jsonObj };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    console.log("form submitted");

    // TODO
  }

  return (
    <div className="body">
      <h1>Welcome to hangman</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Make guess: </label>
          <input
            type="text"
            id="guess"
            value={form.guess}
            onChange={(e) => updateForm({ guess: e.target.value })}
            required
          />
        </div>
        <br />
        <div>
          <input type="submit" value="Guess"></input>
        </div>
      </form>
      <div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}
