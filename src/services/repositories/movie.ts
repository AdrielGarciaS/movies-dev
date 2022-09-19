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
