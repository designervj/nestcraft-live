const { MongoClient } = require("mongodb");

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required");
  return uri;
}

async function listPages() {
  const client = new MongoClient(requireMongoUri());
  try {
    await client.connect();
    const db = client.db("kalp_tenant_furni");
    const pages = await db.collection("pages").find({}).toArray();
    console.log("Pages in DB:", pages.map(p => ({ title: p.title, slug: p.slug })));
  } catch (error) {
    console.error("Error listing pages:", error);
  } finally {
    await client.close();
  }
}

listPages();
