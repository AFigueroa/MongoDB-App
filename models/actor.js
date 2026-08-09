const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birth_year: Number,
    nationality: String,
    movies: [
      {
        movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
        role: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Actor', actorSchema);
