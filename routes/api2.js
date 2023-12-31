import express from "express";
import session from "express-session";
import crypto from "crypto";
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
    const userCollection = [];

    const userToInsert = {
      name: userName,
      psw: userPsw,
      collection: userCollection,
    };

    const result = await myDB2.insertUser(userToInsert);

    res.json({ message: "User inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

const secret = crypto.randomBytes(32).toString("hex");
router.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
  })
);

router.post("/verifyUser", async (req, res) => {
  try {
    const userName = req.body.userName;
    const userPsw = req.body.userPsw;

    const result = await myDB2.verifyUser(userName, userPsw);

    if (result.success) {
      req.session.user = { username: userName };
      res.status(200).json({ success: true, message: "Login successful" });
    } else {
      console.log("Authentication failed:", result.message);
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("An error occurred during user verification:", error);

    console.error("Error during verification:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      console.log("Successfully log out");
      res.status(200).json({ message: "Logout successful" });
    }
  });
});

router.post("/addToCollection", async (req, res) => {
  try {
    const user = req.body.userName;
    const objectId = req.body.drinkId;

    if (!user || !objectId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await myDB2.addCollection(user, objectId);
    res.status(200).json({ message: "Drink added to collection successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/collectDrinks", async (req, res) => {
  try {
    const userName = req.query.userName;
    const result = await myDB2.getDrinks(userName);
    if (result.status === 200) {
      res.json(result.recipesCollection);
    } else {
      res.status(result.status).json(result.message);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/removeFromCollection", async (req, res) => {
  console.log("reached remove from collection");
  try {
    const user = req.query.userName;
    const objectId = req.query.drinkId;

    if (!user || !objectId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    await myDB2.removeFromCollection(user, objectId);
    res.status(200).json({ message: "Drink removed from collection successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




export default router;
