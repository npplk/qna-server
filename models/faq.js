const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = require('./vote');

const faqSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tags: [{ type: String, required: true }],
  score: { type: Number, default: 0 },
  votes: [voteSchema],
  created: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

faqSchema.set('toJSON', { getters: true });

faqSchema.options.toJSON.transform = (doc, ret) => {
  const obj = { ...ret };
  delete obj._id;
  delete obj.__v;
  return obj;
};

faqSchema.methods = {
  vote: function (user, vote) {
    const existingVote = this.votes.find((v) => v.user._id.equals(user));

    if (existingVote) {
      // reset score
      this.score -= existingVote.vote;
      if (vote == 0) {
        // remove vote
        this.votes.pull(existingVote);
      } else {
        //change vote
        this.score += vote;
        existingVote.vote = vote;
      }
    } else if (vote !== 0) {
      // new vote
      this.score += vote;
      this.votes.push({ user, vote });
    }

    return this.save();
  }
};

faqSchema.pre(/^find/, function () {
  this.populate('author')
    .populate('comments.author', '-role')
    .populate('answers.author', '-role')
    .populate('answers.comments.author', '-role');
});

faqSchema.pre('save', function (next) {
  this.wasNew = this.isNew;
  next();
});

faqSchema.post('save', function (doc, next) {
  doc
    .populate('author')
    .populate('answers.author', '-role')
    .populate('comments.author', '-role')
    .populate('answers.comments.author', '-role')
    .execPopulate()
    .then(() => next());
});

module.exports = mongoose.model('Faq', faqSchema);
