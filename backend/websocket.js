const WebSocket = require("ws");
const dbo = require("./db/conn");

const players = [];
const guesses = [];
let wordToGuess = "";

function websocket(server) {
  const wss = new WebSocket.Server({ server });

  // ----- web socket helper -----
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  // ----- main web socket logic -----
  wss.on("connection", (ws) => {
    console.log("client connected");

    // ws recieves messages from the client
    ws.on("message", (message) => {
      console.log(message.toString());
      try {
        const data = JSON.parse(message);

        // state type joing sent from waiting room
        if (data.type === "join") {
          const existing = players.find((p) => p.player === data.player);
          if (existing) {
            existing.ws = ws;
            console.log("player reconnected");
            return;
          }

          if (players.length == 0) {
            const playerObject = {
              player: data.player,
              role: "host",
              ws: ws,
            };
            players.push(playerObject);
            console.log("player added, host set");
            wss.broadcast(
              JSON.stringify({
                message: `${data.player} has joined as host`,
              })
            );
          } else if (data.player != players[0].player) {
            const playerObject = {
              player: data.player,
              role: "guesser",
              ws: ws,
            };
            players.push(playerObject);
            console.log("player added, guesser set");
            wss.broadcast(
              JSON.stringify({
                message: `${data.player} has joined as guesser`,
              })
            );
          }

          // save guessed words TODO
        }

        // game state guess sent from hangman.js
        if (data.type === "guess") {
          const g = data.guess;
          let repeated = false;

          if (guesses.includes(g)) {
            ws.send(
              JSON.stringify({ message: "Already guessed letter: " + g })
            );
            console.log("repeated guess");
            repeated = true;
          }

          if (!repeated) {
            guesses.push(g);
            console.log("guess tracked");
          }
        }
      } catch (err) {
        console.log("message error: ", err.message);
      }
    });

    // ws connection closed
    ws.on("close", () => {
      console.log("client disconnected");
    });
  });

  return wss;
}
module.exports = websocket;
