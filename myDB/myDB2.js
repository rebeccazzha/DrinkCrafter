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

  myDB2.getFacts = async ({ factId } = {}) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");

    let query = {};
    if (factId && factId != 0) {
      query.factId = parseInt(factId, 10);
    }

    try {
      const result = await factsCollection.find(query).toArray();
      return result;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.insertFact = async (fact) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");

    try {
      const result = await factsCollection.insertOne(fact);
      return result;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.voteFact = async (factId, voteType) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");

    try {
      const fact = await factsCollection.findOne({ _id: factId });

      if (!fact) {
        throw new Error("Fact not found");
      }

      if (voteType === "👍") {
        fact.votesInteresting++;
      } else if (voteType === "🤯") {
        fact.votesMindblowing++;
      } else if (voteType === "⛔️") {
        fact.votesFalse++;
      } else {
        throw new Error("Invalid vote type");
      }

      await factsCollection.updateOne({ _id: factId }, { $set: fact });

      return fact;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  return myDB2;
}

export const myDB2 = MyDB2();
