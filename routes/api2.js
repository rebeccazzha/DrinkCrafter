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

export default router;
