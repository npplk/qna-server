const Question = require('../models/question');
const Discussion = require('../models/discussion');
const Faq = require('../models/faq');

exports.ThreadTypes = {
    questions: Question,
    discussions: Discussion,
    faqs: Faq
}