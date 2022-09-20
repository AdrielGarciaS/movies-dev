import { NextApiHandler } from 'next';
import { createMovieComment, getComments } from 'server/repositories/movie';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const comment = await createMovieComment({
      title: req.body.title,
      comment: req.body.comment,
    });

    return res.status(200).json(comment);
  }

  if (req.method === 'GET') {
    const comments = await getComments();

    return res.status(200).json(comments);
  }
};

export default handler;
