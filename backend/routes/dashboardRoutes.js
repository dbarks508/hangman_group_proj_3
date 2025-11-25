const express = require("express");
const dashboardRoutes = express.Router();
const dbo = require("../db/conn");

// Route to get leaderboard data. Sorted by least amount of guesses (Ascending)
dashboardRoutes.route("/leaderboard").get(async (req, res) => {
  try {
    let db = dbo.getDB();
    const gameCollection = db.collection("game_data");

    // Getting all records
    // Sorting by: { numberOfGuesses: 1 } to get the smallest number first
    const gameData = await gameCollection.find({}).sort({ numberOfGuesses: 1 }).toArray();

    // Check if data exists
    if (!gameData || gameData.length === 0) {
        console.log("[Backend] No game data found.");
        return res.json({ leaderboard: [] });
    }

    // Debugging
    console.log(`[Backend] Found ${gameData.length} game records`);

    // Creating a list to put it all into
    let formattedLeaderboard = [];
    
    gameData.forEach((game) => {
        // Pushing only the requested fields
        formattedLeaderboard.push({
            userID: game.userID,
            Name: game.Name,
            phraseGuessed: game.phraseGuessed,
            numberOfGuesses: game.numberOfGuesses,
            fromDatabaseOrCustom: game.fromDatabaseOrCustom,
            successfulOrNot: game.successfulOrNot
        });
    });

    // Sending to frontend
    return res.json({ leaderboard: formattedLeaderboard });

  } catch (err) {
    console.error("Error in /leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard information" });
  }
});

module.exports = dashboardRoutes;