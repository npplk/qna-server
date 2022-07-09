const Discussion = require('../models/discussion');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.loadDiscussion = async (req, res, next, id) => {
  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ message: 'Discussion not found.' });
    req.thread = discussion;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid discussion id.' });
    return next(error);
  }
  next();
};

exports.createDiscussion = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { title, tags, text } = req.body;
    const author = req.user.id;
    const discussion = await Discussion.create({
      title,
      author,
      tags,
      text
    });
    res.status(201).json(discussion);
  } catch (error) {
    next(error);
  }
};

exports.showDiscussion = async (req, res, next) => {
  try {
    const { id } = req.thread;
    const discussion = await Discussion.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('answers');
    res.json(discussion);
  } catch (error) {
    next(error);
  }
};

exports.listDiscussions = async (req, res, next) => {
  try {
    const { sortType = '-score' } = req.body;
    const discussions = await Discussion.find().sort(sortType);
    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

exports.listDiscussionsByTags = async (req, res, next) => {
  try {
    const { sortType = '-score', tags } = req.params;
    const discussions = await Discussion.find({ tags: { $all: tags } }).sort(sortType);
    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

exports.listDiscussionsByUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { sortType = '-created' } = req.body;
    const author = await User.findOne({ username });
    const discussions = await Discussion.find({ author: author.id }).sort(sortType).limit(10);
    res.json(discussions);
  } catch (error) {
    next(error);
  }
};

exports.removeDiscussion = async (req, res, next) => {
  try {
    await req.thread.remove();
    res.json({ message: 'Your discussion successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.loadComment = async (req, res, next, id) => {
  try {
    const comment = await req.discussion.comments.id(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    req.comment = comment;
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid comment id.' });
    return next(error);
  }
  next();
};

exports.discussionValidate = [
  body('title')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 180 })
    .withMessage('must be at most 180 characters long'),

  body('text')
    .exists()
    .trim()
    .withMessage('is required')

    .isLength({ min: 10 })
    .withMessage('must be at least 10 characters long')

    .isLength({ max: 5000 })
    .withMessage('must be at most 5000 characters long'),

  body('tags').exists().withMessage('is required')
];
