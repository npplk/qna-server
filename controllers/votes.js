exports.upvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) {
    console.log(req.answer.vote);
    req.answer.vote(id, 1);
    const thread = await req.thread.save();
    return res.json(thread);
  }
  const thread = await req.thread.vote(id, 1);
  return res.json(thread);
};

exports.downvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) {
    req.answer.vote(id, -1);
    const thread = await req.thread.save();
    return res.json(thread);
  }
  const thread = await req.thread.vote(id, -1);
  return res.json(thread);
};

exports.unvote = async (req, res) => {
  const { id } = req.user;

  if (req.answer) {
    req.answer.vote(id, 0);
    const thread = await req.thread.save();
    return res.json(thread);
  }
  const thread = await req.thread.vote(id, 0);
  return res.json(thread);
};
