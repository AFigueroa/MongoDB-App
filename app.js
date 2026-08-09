const { MongoClient } = require('mongodb');

const url = 'mongodb://127.0.0.1:27017/moviedb';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB at', url);

    const db = client.db();
    const movies = await db.collection('movies').find({}).toArray();

    console.log(`\nFound ${movies.length} movie(s):\n`);
    movies.forEach((movie) => {
      console.log(`- ${movie.title} (${movie.year}) — rating: ${movie.rating}`);
    });
  } catch (err) {
    console.error('Failed to read movie data:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
