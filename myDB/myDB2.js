import { MongoClient } from "mongodb";

function MyDB2() {
  const uri2 = "mongodb://localhost:27017/funFacts";

  const connectToMongoDB = async () => {
    const client2 = new MongoClient(uri2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client2.connect();
    const db2 = client2.db("funFacts");

    return { client2, db2 };
  };

  myDB2.getFacts = async ({ baseId } = {}) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");
    console.log("Connected to MongoDB");

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

  return myDB2;
}

export const myDB2 = MyDB2();
