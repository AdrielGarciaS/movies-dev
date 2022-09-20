import { api } from 'services/api';

export interface GetClientMoviesParams {
  q?: string;
  page?: number;
  pageSize?: number;
  genre?: string;
}

interface GetClientMoviesResponse {
  totalRegisters: number;
  movies: AdaptedMovie[];
}

export const getClientMovies = async (params: GetClientMoviesParams) => {
  const response = await api.get<GetClientMoviesResponse>('/movies', {
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
