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
        console.log(`data.type: ${data.type} || data.guess: ${data.guess}`);

        if (data.type === "join") {
          players.push(data.player);
          console.log("player added");
        }

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
