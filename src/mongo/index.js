import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://ongchen10sherpa:pWMZP2hJ96ZnO8up@cluster0.hutsice.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function setupDatabase() {
  try {
    await client.connect();
    const db = client.db("sample_mflix");
    return {
      client,
      db,
      users: db.collection("users"),
      movies: db.collection("movies"),
    };
  } catch (err) {
    console.log("Error while connecting to db");
  }
}
