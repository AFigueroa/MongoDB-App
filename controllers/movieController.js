const Movie = require('../models/movie');
const catchAsync = require('../utils/catchAsync');

exports.getAllMovies = catchAsync(async (req, res) => {
  const movies = await Movie.find();
  res.json({ count: movies.length, data: movies });
});

exports.getMovie = catchAsync(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json({ data: movie });
});

exports.createMovie = catchAsync(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json({ data: movie });
});

exports.updateMovie = catchAsync(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json({ data: movie });
});

exports.deleteMovie = catchAsync(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json({ message: 'Movie deleted' });
});
