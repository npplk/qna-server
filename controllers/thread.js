const { ThreadTypes } = require('../utils/util');

exports.loadThread = async (req, res, next, type) => {
  try {
    const thread = await ThreadTypes[type].findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: 'Thread not found.' });
    req.threadType = type;
    req.thread = thread;
  } catch (error) {
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid post id.' });
    return next(error);
  }
  next();
};

exports.removeThread = async (req, res, next) => {
  try {
    await req.thread.remove();
    res.json({ message: 'Your post successfully deleted.' });
  } catch (error) {
    next(error);
  }
};