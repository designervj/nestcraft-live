const { MongoClient } = require('mongodb');
require('dotenv').config();

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required");
  return uri;
}

async function checkFullDoc() {
  const uri = requireMongoUri();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kalp_tenant_furni");
    const doc = await db.collection("products").findOne({ sku: "TEST-1" });
    console.log(JSON.stringify(doc, null, 2));
  } finally {
    await client.close();
  }
}
checkFullDoc();
