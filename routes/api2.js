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

export default router;
