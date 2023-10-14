import "dotenv/config";

import { MongoClient } from "mongodb";

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

  // myDB2.insertToken = async (userId, token) => {
  //   const { client2, db2 } = await connectToMongoDB();
  //   const tokenCollection = db2.collection("token");

  //   try {
  //     await tokenCollection.insertOne({ userId, token });
  //   } finally {
  //     await client2.close();
  //   }
  // };

  // myDB2.getTokenByUserId = async (token) => {
  //   const { client2, db2 } = await connectToMongoDB();
  //   const tokenCollection = db2.collection("token");

  //   try {
  //     const tokenData = await tokenCollection.findOne({ token });
  //     return tokenData ? tokenData.userId : null;
  //   } finally {
  //     await client2.close();
  //   }
  // };

  myDB2.deleteToken = async (userId, token) => {
    const { client2, db2 } = await connectToMongoDB();
    const tokenCollection = db2.collection("token");

    try {
      await tokenCollection.deleteOne({ userId, token });
    } finally {
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
