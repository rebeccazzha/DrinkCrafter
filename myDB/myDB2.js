import "dotenv/config";

import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

function MyDB2() {
  const uri2 = process.env.MONGO_URL;
  const myDB2 = {};

  const connectToMongoDB = async () => {
    const client2 = new MongoClient(uri2);
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

  myDB2.insertUser = async (user) => {
    const { client2, db2 } = await connectToMongoDB();
    const usersCollection = db2.collection("user");

    try {
      const result = await usersCollection.insertOne(user);
      return result;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.verifyUser = async (userName, userPsw) => {
    const { client2, db2 } = await connectToMongoDB();
    const usersCollection = db2.collection("user");

    const user = await usersCollection.findOne({ name: userName });

    try {
      if (!user) {
        console.log("User not found");
        return { success: false, message: "User not found" };
      }

      if (user.psw !== userPsw) {
        console.log("Password incorrect");
        return { success: false, message: "Incorrect password" };
      }
      console.log("Password correct");

      return { success: true, user };
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.addCollection = async (user, objectId) => {
    const { client2, db2 } = await connectToMongoDB();
    const usersCollection = db2.collection("user");
    const drinksCollection = db2.collection("recipe");

    const dbObjectId = new ObjectId(objectId);

    try {
      if (user && objectId) {
        const document = await drinksCollection.findOne({ _id: dbObjectId });
        console.log("document: " + document);

        if (document) {
          const result = await usersCollection.updateOne(
            { name: user },
            { $push: { collection: document } }
          );

          if (result.modifiedCount > 0) {
            console.log("Document added to the collection successfully");
          } else {
            console.log("No documents matched the query");
          }
        } else {
          console.log("Document not found.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.voteFact = async (factId, voteType) => {
    const { client2, db2 } = await connectToMongoDB();
    const factsCollection = db2.collection("funFacts");
    const dbObjectId = new ObjectId(factId);
    console.log(dbObjectId, voteType);

    try {
      const fact = await factsCollection.findOne({ _id: dbObjectId });
      console.log("FACT: " + fact);

      if (!fact) {
        throw new Error("Fact not found");
      }

      if (voteType === "👍") {
        await factsCollection.updateOne(
          { _id: dbObjectId },
          { $set: { votesInteresting: fact.votesInteresting + 1 } }
        );
      } else if (voteType === "🤯") {
        await factsCollection.updateOne(
          { _id: dbObjectId },
          { $set: { votesMindblowing: fact.votesMindblowing + 1 } }
        );
        console.log("VOTE: " + fact.votesMindblowing);
      } else if (voteType === "⛔️") {
        await factsCollection.updateOne(
          { _id: dbObjectId },
          { $set: { votesFalse: fact.votesFalse + 1 } }
        );
        console.log("VOTE: " + fact.votesFalse);
      } else {
        throw new Error("Invalid vote type");
      }

      return fact;
    } finally {
      console.log("DB closing connection");
      await client2.close();
    }
  };

  myDB2.getDrinks = async (userName) => {
    const { client2, db2 } = await connectToMongoDB();
    const usersCollection = db2.collection("user");

    try {
      const userSelect = await usersCollection.findOne({ name: userName });

      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }
      const recipesCollection = userSelect.collection;
      if (!Array.isArray(recipesCollection)) {
        return { status: 400, message: "Recipes collection is not an array" };
      }

      console.log("recipesCollection is a array!");

      return { status: 200, recipesCollection };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client2.close();
    }
  };

  return myDB2;
}

export const myDB2 = MyDB2();
