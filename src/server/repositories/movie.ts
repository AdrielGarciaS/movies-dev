import axios from 'axios';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';

import { database } from 'server/services/firebase';

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

export const createMovieComment = async (
  params: MovieComment,
): Promise<AdaptedMovieComment> => {
  const { title, comment } = params;

  const dbInstance = collection(database, 'comment');

  await addDoc(dbInstance, { title, comment });

  return { id: uuid(), title, comment };
};

export const getComments = async (): Promise<AdaptedMovieComment[]> => {
  const dbInstance = collection(database, 'comment');

  const response = await getDocs(dbInstance);

  const comments = response.docs.map<AdaptedMovieComment>(item => {
    const { title, comment } = item.data();

    return { id: uuid(), title, comment };
  });

  return comments;
};
