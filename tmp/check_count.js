const { MongoClient } = require('mongodb');
require('dotenv').config();

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required");
  return uri;
}

async function checkCount() {
  const uri = requireMongoUri();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kalp_tenant_furni");
    const count = await db.collection("products").countDocuments();
    console.log(`Total products in kalp_tenant_furni: ${count}`);
    const docs = await db.collection("products").find({}).limit(10).toArray();
    docs.forEach(doc => console.log(`- ${doc.name} (SKU: ${doc.sku})`));
  } finally {
    await client.close();
  }
}
checkCount();
