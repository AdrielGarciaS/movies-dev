import { api } from 'services/api';

export interface GetClientMoviesParams {
  q?: string;
  page?: number;
  pageSize?: number;
  genre?: string;
}

export const getClientMovies = async (params: GetClientMoviesParams) => {
  const response = await api.get<{
    totalPages: number;
    movies: AdaptedMovie[];
  }>('/movies', {
    params,
  });

  return response.data;
};

interface CreateClientComment {
  title: string;
  comment: string;
}

export const createClientComment = async (
  params: CreateClientComment,
): Promise<AdaptedMovieComment> => {
  const response = await api.post('/comments', params);

  return response.data;
};

export const getClientComments = async (): Promise<AdaptedMovieComment[]> => {
  const response = await api.get('/comments');

  return response.data;
};
