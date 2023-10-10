import express from 'express';
const router = express.Router();
import { myDB } from '../myDB/myDB.js';

router.get('/drinks', async (req, res) => {
  try {
    const baseId = req.query.base_id;
    const drinks = await myDB.getDrinks({ baseId });
    res.json(drinks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;