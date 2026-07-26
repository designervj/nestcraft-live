const { MongoClient } = require('mongodb');
require('dotenv').config();

function requireMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new Error("MONGODB_URI is required");
  return uri;
}

async function listDbs() {
  const uri = requireMongoUri();
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log(dbs.databases.map(db => db.name).join('\n'));
  } finally {
    await client.close();
  }
}
listDbs();
