const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const { EJSON } = require('bson');

const url = 'mongodb://127.0.0.1:27017/moviedb';
const client = new MongoClient(url);

const dataDir = path.join(__dirname, 'data');
const files = ['movies.json', 'reviews.json', 'actors.json'];

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB at', url);

    const db = client.db();

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const collectionName = path.basename(file, '.json');
      const raw = fs.readFileSync(filePath, 'utf8');
      const docs = EJSON.parse(raw);
      const collection = db.collection(collectionName);

      const existing = await collection.countDocuments();
      if (existing === 0) {
        const result = await collection.insertMany(docs);
        console.log(`Seeded ${result.insertedCount} document(s) into "${collectionName}"`);
      } else {
        console.log(`"${collectionName}" already has data; skipping`);
      }
    }
  } catch (err) {
    console.error('Failed to seed database:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
