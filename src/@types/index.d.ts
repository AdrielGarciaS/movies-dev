interface Movie {
  year: string;
  votes: string;
  title: string;
  runtime: string;
  revenue: string;
  rating: string;
  rank: string;
  metascore: string;
  genre: string[];
  director: string;
  description: string;
  actors: string[];
}

interface AdaptedMovie extends Movie {
  genres: string;
}

interface MovieComment {
  title: string;
  comment: string;
}

interface AdaptedMovieComment extends MovieComment {
  id: string;
}
