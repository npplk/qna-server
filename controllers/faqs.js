const Faq = require('../models/faq');
const { body, validationResult } = require('express-validator');

exports.loadFaq = async (req, res, next, id) => {
  try {
    const faq = await Faq.findById(id);
    if (!faq) return res.status(404).json({ message: 'Faq not found.' });
    req.faq = faq;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid faq id.' });
    return next(error);
  }
  next();
};

exports.createFaq = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { title, tags, question, answer } = req.body;
    const author = req.user.id;
    const faq = await Faq.create({
      title,
      author,
      tags,
      question,
      answer,
    });
    res.status(201).json(faq);
  } catch (error) {
    next(error);
  }
};

exports.showFaq = async (req, res, next) => {
  try {
    const { id } = req.faq;
    const faq = await Faq.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('answers');
    res.json(faq);
  } catch (error) {
    next(error);
  }
};

exports.listFaqs = async (req, res, next) => {
  try {
    const { sortType = '-score' } = req.body;
    const faqs = await Faq.find().sort(sortType);
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

exports.listFaqsByTags = async (req, res, next) => {
  try {
    const { sortType = '-score', tags } = req.params;
    const faqs = await Faq.find({ tags: { $all: tags } }).sort(sortType);
    res.json(faqs);
  } catch (error) {
    next(error);
  }
};

exports.removeFaq = async (req, res, next) => {
  try {
    await req.faq.remove();
    res.json({ message: 'Your faq successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

exports.faqValidate = [
  body('title')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 180 })
    .withMessage('must be at most 180 characters long'),

  body('question')
    .exists()
    .trim()
    .withMessage('is required')

    .isLength({ min: 10 })
    .withMessage('must be at least 10 characters long')

    .isLength({ max: 5000 })
    .withMessage('must be at most 5000 characters long'),

  body('answer')
    .exists()
    .trim()
    .withMessage('is required')

    .isLength({ min: 10 })
    .withMessage('must be at least 10 characters long')

    .isLength({ max: 5000 })
    .withMessage('must be at most 5000 characters long'),

  body('tags').exists().withMessage('is required')
];
