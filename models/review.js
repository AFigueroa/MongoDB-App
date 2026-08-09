const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
    comment: String,
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
