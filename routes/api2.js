import express from "express";
const router = express.Router();
import { myDB2 } from "../myDB/myDB2.js";

router.get("/funFacts", async (req, res) => {
  try {
    const baseId = req.query.base_id;
    const facts = await myDB2.getFacts(baseId);
    res.json(facts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
