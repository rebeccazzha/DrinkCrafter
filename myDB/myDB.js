import { MongoClient } from "mongodb";

function MyDB() {
  const uri = "mongodb://localhost:27017/DrinkCrafter";
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
  
  

  return myDB;
}

export const myDB = MyDB();
