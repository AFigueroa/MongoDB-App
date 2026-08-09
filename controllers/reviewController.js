const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find().populate('movie_id', 'title year');
  res.json({ count: reviews.length, data: reviews });
});

exports.getReview = catchAsync(async (req, res) => {
  const review = await Review.findById(req.params.id).populate('movie_id', 'title year');
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ data: review });
});

exports.createReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json({ data: review });
});

exports.updateReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ data: review });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted' });
});
