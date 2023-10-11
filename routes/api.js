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

router.post("/postDrink", async (req, res) => {
  try {
    const name = req.body.name;
    const image = req.body.image_url;
    const ingredients = req.body.ingredients;
    const base = req.body.base;
    const recipe = req.body.recipe;

    const baseToBaseId = {
      vodka: 1,
      whiskey: 2,
      rum: 3,
      tequila: 4,
      gin: 5,
      brandy: 7,
      mixed: 6,
    };

    const currentBaseId = baseToBaseId[base];

    const newDrink = {
      base_id: currentBaseId,
      recipe: recipe,
      description: ingredients,
      image_url: image,
      label: name,
    };

    const result = await myDB.addNewDrink(newDrink);

    res.json({ message: "Drink inserted successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


export default router;
