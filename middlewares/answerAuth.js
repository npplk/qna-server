const answerEditAuth = (req, res, next) => {
  if (req.answer.author._id.equals(req.user.id)) return next();
  res.status(401).end();
};

const answerDeleteAuth = (req, res, next) => {
  if (req.answer.author._id.equals(req.user.id) || req.user.role === 'admin') return next();
  res.status(401).end();
};

const answerPostAuth = (req, res, next) => {
  if (req.threadType !== "questions" ||  req.user.role === 'staff') return next();
  res.status(401).end();
};

module.exports = {
  answerEditAuth,
  answerDeleteAuth,
  answerPostAuth,
}
