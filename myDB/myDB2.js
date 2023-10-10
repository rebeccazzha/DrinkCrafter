import { MongoClient } from "mongodb";

function MyDB2() {
  const uri2 =
    "mongodb+srv://RebeccaZYH:xwS8lx84M58ajNWE@cluster-funfacts.icnk34i.mongodb.net/";
  const myDB2 = {};

  const connectToMongoDB = async () => {
    const client2 = new MongoClient(uri2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client2.connect();
    const db2 = client2.db("DrinkCrafter");

    return { client2, db2 };
  };

  myDB2.getFacts = async ({ baseId } = {}) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");

    let query = {};
    if (baseId && baseId != 0) {
      query.base_id = parseInt(baseId, 10);
    }

    try {
      const result = await factsCollection.find(query).toArray();
      return result;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.getFactsById = async (_id) => {
    const { client, db } = await connect();
    const drinksCollection = db.collection("funFacts");

    try {
      const result = await factsCollection.findOne({ _id: new ObjectId(_id) });
      return result;
    } catch (error) {
      console.error(error);
    } finally {
      console.log("DB closing connection");
      await client.close();
    }
  };

  return myDB2;
}

export const myDB2 = MyDB2();
