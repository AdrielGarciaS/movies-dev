import { NextApiHandler } from 'next';

import { getMovies } from 'server/repositories/movie';

const handler: NextApiHandler = async (req, res) => {
  const { q = '', page = 1, pageSize = 10, genre = '' } = req.query;

  const movies = await getMovies({
    q: q ? String(q) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    genre: genre ? String(genre) : undefined,
  });

  res.status(200).json(movies);
};

export default handler;
