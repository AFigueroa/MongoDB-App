const Actor = require('../models/actor');
const catchAsync = require('../utils/catchAsync');

exports.getAllActors = catchAsync(async (req, res) => {
  const actors = await Actor.find().populate('movies.movie_id', 'title year');
  res.json({ count: actors.length, data: actors });
});

exports.getActor = catchAsync(async (req, res) => {
  const actor = await Actor.findById(req.params.id).populate('movies.movie_id', 'title year');
  if (!actor) return res.status(404).json({ message: 'Actor not found' });
  res.json({ data: actor });
});

exports.createActor = catchAsync(async (req, res) => {
  const actor = await Actor.create(req.body);
  res.status(201).json({ data: actor });
});

exports.updateActor = catchAsync(async (req, res) => {
  const actor = await Actor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!actor) return res.status(404).json({ message: 'Actor not found' });
  res.json({ data: actor });
});

exports.deleteActor = catchAsync(async (req, res) => {
  const actor = await Actor.findByIdAndDelete(req.params.id);
  if (!actor) return res.status(404).json({ message: 'Actor not found' });
  res.json({ message: 'Actor deleted' });
});
