import axios from 'axios';

import { MoviesApi } from 'utils/constants';

export const getGenres = async () => {
  const response = await axios.get<Movie[]>(MoviesApi.GET_MOVIES);

  const genres = response.data.reduce((acc, movie) => {
    const { genre } = movie;

    genre.forEach(genreName => {
      if (!acc.includes(genreName)) {
        acc.push(genreName);
      }
    });

    return acc;
  }, [] as string[]);

  return genres;
};

const paginateMovies = (movies: Movie[], page: number, pageSize: number) => {
  const start = (Number(page) - 1) * Number(pageSize);
  const end = start + Number(pageSize);
  return movies.slice(start, end);
};

const filterByGenre = (movies: Movie[], genre: string) => {
  return movies.filter(movie => movie.genre.includes(genre));
};

const movieAdapter = (movie: Movie): AdaptedMovie => {
  return {
    ...movie,
    genres: movie.genre.join(', '),
  };
};

interface GetMoviesParams {
  q?: string;
  page?: number;
  pageSize?: number;
  genre?: string;
}

interface GetMoviesResponse {
  movies: AdaptedMovie[];
  totalPages: number;
}

export const getMovies = async (
  params: GetMoviesParams,
): Promise<GetMoviesResponse> => {
  const { q, page = 1, pageSize = 10, genre = '' } = params;

  const response = await axios.get<Movie[]>(MoviesApi.GET_MOVIES);

  const filteredByGenre = genre
    ? filterByGenre(response.data, genre)
    : response.data;

  if (q) {
    const normalizedQuery = q.toLocaleLowerCase();

    const filteredMovies = filteredByGenre.filter(movie => {
      const lowerCased = movie.title.toLowerCase();

      const titleMatches = lowerCased.includes(normalizedQuery);

      return titleMatches;
    });

    const paginatedMovies = paginateMovies(filteredMovies, page, pageSize);

    const totalPages = Math.ceil(filteredMovies.length / pageSize);

    return { movies: paginatedMovies.map(movieAdapter), totalPages };
  }

  const paginatedMovies = paginateMovies(filteredByGenre, page, pageSize);

  const totalPages = Math.ceil(paginatedMovies.length / pageSize);

  return { movies: paginatedMovies.map(movieAdapter), totalPages };
};
