const discussionsAuth = (req, res, next) => {
    if (req.discussion.author._id.equals(req.user.id) || req.user.role === 'admin') return next();
    res.status(401).end();
};

module.exports = discussionsAuth;