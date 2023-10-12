import express from "express";
const router = express.Router();
import { myDB2 } from "../myDB/myDB2.js";

router.get("/funFacts", async (req, res) => {
  try {
    const factId = req.query.factId;
    const facts = await myDB2.getFacts({ factId });
    res.json(facts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/postFact", async (req, res) => {
  try {
    const factText = req.body.factText;
    const source = req.body.source;
    const category = req.body.category;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const categoryToFactId = {
      rum: 1,
      whiskey: 2,
      vodka: 3,
      tequila: 4,
      gin: 5,
      brandy: 6,
      wine: 7,
    };

    const currentFactId = categoryToFactId[category];

    const factToInsert = {
      factId: currentFactId,
      text: factText,
      source: source,
      category: category,
      votesInteresting: 0,
      votesMindblowing: 0,
      votesFalse: 0,
      createdIn: currentYear,
    };

    const result = await myDB2.insertFact(factToInsert);

    res.json({ message: "Fact inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/voteFact", async (req, res) => {
  try {
    const factId = req.body.factId;
    const voteType = req.body.voteType;
    console.log(factId, voteType);

    if (!factId || !voteType) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const result = await myDB2.voteFact(factId, voteType);

    res.json({ message: "Vote recorded successfully", updatedFact: result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/addUser", async (req, res) => {
  try {
    const userName = req.body.userName;
    const userPsw = req.body.userPsw;
    const userCollection = req.body.userCollection || "";

    const userToInsert = {
      name: userName,
      psw: userPsw,
      collection: userCollection,
    };

    res.json({ message: "Fact inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/verifyUser", async (req, res) => {
  try {
    const userName = req.body.userName;
    const userPsw = req.body.userPsw;

    const result = await myDB2.verifyUser(userName, userPsw);

    if (result.success) {
      const token = `user-${result.user._id}-${Math.random()
        .toString(36)
        .substring(7)}`;

      await myDB2.insertToken(result.user._id, token);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/logout", async (req, res) => {
  const token = req.headers.authorization;

  const userId = await myDB2.getUserIdByToken(token);

  if (userId) {
    await myDB2.deleteToken(userId, token);
    res.json({ message: "User logged out successfully" });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
