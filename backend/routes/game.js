const express = require("express");
const gameRoutes = express.Router();
const dbo = require("../db/conn");

gameRoutes.post("/init-game", (req, res) => {
  const { player, word } = req.body;

  if (!player) {
    return res.status(400).send("no player data");
  }

  req.session.player = player;
  req.session.word = word;

  res.send({ message: "session set" });
});

gameRoutes.get("/verify", (req, res) => {
  let status = "";
  if (!req.session.player) {
    status = "no session set";
  } else {
    status = "valid session";
  }

  // send data back
  const data = {
    status: status,
    player: req.session.player,
    word: req.session.word,
  };

  res.json(data);
});

module.exports = gameRoutes;
