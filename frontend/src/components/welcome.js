import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Welcome() {
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    player: "",
    word: "",
  });

  function updateForm(jsonObj) {
    return setForm((prevJsonObj) => {
      return { ...prevJsonObj, ...jsonObj };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();

    const playerData = {
      player: form.player,
      guess: form.guess,
    };
    const responce = await fetch("http://localhost:4000/init-game", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(playerData),
    });

    const data = await responce.json();

    if (data.message === "session set") {
      console.log("Data recieved from route /init-game: ", data);
      navigate("/waiting");
    } else {
      setErrorMessage("Problem setting session data.");
    }

    // TODO
  }

  return (
    <div className="body">
      <h1>Welcome to hangman!</h1>
      <h3>Enter your name and a word for your opponent to guess</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>Player name: </label>
          <input
            type="text"
            id="player-name"
            value={form.player}
            onChange={(e) => updateForm({ player: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Word: </label>
          <input
            type="text"
            id="word"
            value={form.word}
            onChange={(e) => updateForm({ word: e.target.value })}
            required
          />
        </div>
        <br />
        <div>
          <input type="submit" value="Submit"></input>
        </div>
      </form>
      <div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}
