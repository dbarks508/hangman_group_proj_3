const express = require("express");
const gameRoutes = express.Router();
const dbo = require("../db/conn");

gameRoutes.get("/play", (req, res) => {
  const { player } = req.body;

  if (!player) {
    return res.status(400).send("no player data");
  }

  req.session.player = player;

  res.send({ message: "session set" });
});

module.exports = gameRoutes;
