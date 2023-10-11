import { MongoClient, ObjectId } from "mongodb";

function MyDB() {
  const uri = "mongodb+srv://RebeccaZYH:xwS8lx84M58ajNWE@cluster-funfacts.icnk34i.mongodb.net/";
  const myDB = {};

  const connect = async () => {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    await client.connect();
    const db = client.db("DrinkCrafter");

    return { client, db };
  };

  myDB.getDrinks = async ({ baseId } = {}) => {
    const { client, db } = await connect();
    const drinksCollection = db.collection("recipe");
    
    let query = {};
    if (baseId && baseId != 0) {
      query.base_id = parseInt(baseId, 10);
    }
    
    try {
      const result = await drinksCollection.find(query).toArray();
      return result;
    } finally {
      console.log("DB closing connection");
      await client.close();
    }
  };
  
  myDB.getDrinkById = async (_id) => {
    const { client, db } = await connect();
    const drinksCollection = db.collection("recipe");
    
    try {
      const result = await drinksCollection.findOne({ _id: new ObjectId(_id) });
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      console.log("DB closing connection");
      await client.close();
    }
  };

  myDB.addNewDrink = async (newDrink) => {
    const { client, db } = await connect();
    const drinksCollection = db.collection("recipe");
    
    try {
      const result = await drinksCollection.insertOne(newDrink);
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  };

  return myDB;
}

export const myDB = MyDB();
