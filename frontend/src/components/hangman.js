import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Hangman() {
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState({
    guess: "",
  });

  // use effect
  useEffect(() => {

  // verify the session
    async function verify() {
      const response = await fetch(`http://localhost:4000/verify`, {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (data.status === "no session set") {
        navigate("/");
        return;
      }

      setData(data);

      // connect websocket
      const websocket = new WebSocket("ws://localhost:4000");
      setWs(websocket);
    }

  }, [navigate]);

  // handle form changes, including disallowing changes if user is a host
  function updateForm(jsonObj) {
    // disallow changes if user is a host
    if (data.req.session.player.isHost) {
      return;
    }
    return setForm((prevJsonObj) => {
      return { ...prevJsonObj, ...jsonObj };
    });
  }

  // handle button press, disallow if user is a host
  async function onSubmit(e) {
    e.preventDefault();

    // disallow press if user is a host
    if (data.req.session.player.isHost) {
      return;
    }

    console.log("form submitted");

    // TODO
    const guessData = {
      type: "guess",
      guess: form.guess,
      player: data.player,
    };
    ws.send(JSON.stringify(guessData));

    // reset form
    setForm({ guess: "" });

    // listen for messages
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage("");
        }
      } catch (err) {
        console.log("error parsing data");
      }
    };

    // display returned word on screen
  }

  return (
    <div className="body">
      <h1>Welcome to hangman</h1>
      <div class="wordDisplay">
        <h2>
          Word to guess:{" "}
          {data && data.word
            ? data.word
                .split("")
                .map((char) => (char === "_" ? "_ " : char + " "))
            : ""}
        </h2>
      </div>
      <br></br>
      <p>Make your guess below:</p>
      <form onSubmit={onSubmit}>
        <div class="guessInput">
          <label>Make guess: </label>
          <input
            type="text"
            id="guess"
            value={form.guess}
            onChange={(e) => updateForm({ guess: e.target.value })}
            required
            maxLength={1}
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
