const { MongoClient } = require('mongodb');
require('dotenv').config();

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required");
  return uri;
}

async function checkSchema() {
  const uri = requireMongoUri();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("kolp_tenant_goodyearbiketires");
    const products = db.collection("products");
    const doc = await products.findOne({});
    console.log(JSON.stringify(doc, null, 2));
  } finally {
    await client.close();
  }
}
checkSchema();
