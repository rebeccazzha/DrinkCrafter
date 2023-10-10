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

  /////////////////////////////////////////////

  const uri2 =
    "mongodb+srv://RebeccaZYH:xwS8lx84M58ajNWE@cluster-funfacts.icnk34i.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

  return myDB;
}

export const myDB = MyDB();
