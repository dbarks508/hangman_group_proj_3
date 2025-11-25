const express = require("express");
const dashboardRoutes = express.Router();
// Assuming you have this file setup as per your example
const dbo = require("../db/conn");

// Route to get leaderboard data
// - Sorted by least amount of guesses (Ascending)
dashboardRoutes.route("/leaderboard").get(async (req, res) => {
  try {
    // Connect to database
    let db = dbo.getDB();
    
    // Access the 'game_data' collection (from your image)
    const gameCollection = db.collection("game_data");

    // Query: Find all records
    // Sorting by: { numberOfGuesses: 1 } to get the smallest number first
    const gameData = await gameCollection.find({}).sort({ numberOfGuesses: 1 }).toArray();

    // Check if data exists
    if (!gameData || gameData.length === 0) {
        console.log("[Backend] No game data found.");
        return res.json({ leaderboard: [] });
    }

    // Debugging
    console.log(`[Backend] Found ${gameData.length} game records`);

    // Mapping the data to a clean list
    let formattedLeaderboard = [];
    
    gameData.forEach((game) => {
        // Pushing only the requested fields
        formattedLeaderboard.push({
            // Using _id if you need a unique key for React, otherwise userID is fine
            id: game._id.toString(), 
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