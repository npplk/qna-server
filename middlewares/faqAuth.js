const faqsAuth = (req, res, next) => {
    if (req.user.role === 'admin') return next();
    res.status(401).end();
};
  
module.exports = faqsAuth;