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

router.get('/details/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const drinkDetails = await myDB.getDrinkById(_id);
    res.json(drinkDetails);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});


export default router;
