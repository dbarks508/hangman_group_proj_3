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

gameRoutes.post("/init-game-random", async (req, res) => {
  const { player } = req.body;

  if (!player) {
    return res.status(400).send("no player data");
  }

  // get random word from db
  let db = dbo.getDB();
  const randomWordCollection = db.collection("random_words");
  const randomWord = await randomWordCollection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();

  req.session.player = player;
  req.session.word = randomWord[0].word;

  console.log(
    `Session player and word: ${req.session.player} | ${req.session.word}`
  );

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

  console.log(
    `Session player and word: ${req.session.player} | ${req.session.word}`
  );

  res.json(data);
});

module.exports = gameRoutes;
