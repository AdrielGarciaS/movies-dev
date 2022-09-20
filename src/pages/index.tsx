import {
  Center,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';
import { GetServerSideProps } from 'next';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Select } from 'components/Select';

import { getGenres, getMovies } from 'server/repositories/movie';
import { getClientMovies } from 'services/repositories/movie';
import { CommentsModal } from 'components/CommentsModal';

interface Props {
  initialMovies: AdaptedMovie[];
  totalPages: number;
  genres: string[];
}

const Home = (props: Props) => {
  const { initialMovies, totalPages, genres } = props;

  const [movies, setMovies] = useState(initialMovies);
  const [selectedMovie, setSelectedMovie] = useState<AdaptedMovie | null>(null);
  const [genre, setGenre] = useState('');
  const [title, setTitle] = useState('');

  const [debouncedTitle] = useDebounce(title, 300);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const loadMovies = async (q?: string) => {
    const data = await getClientMovies({ q, genre });

    setMovies(data.movies);
  };

  useEffect(() => {
    loadMovies(debouncedTitle);
  }, [debouncedTitle, genre]);

  useEffect(() => {
    const query: Record<string, string> = {};

    if (genre) query.genre = genre;

    if (debouncedTitle) query.q = debouncedTitle;

    router.push('/', { query }, { shallow: true });
  }, [debouncedTitle, genre]);

  useEffect(() => {
    const { query } = router;

    if (!query.genre && !query.q) return;

    setGenre(query.genre as string);
    setTitle(query.q as string);
  }, []);

  const onGenreChange = (value: string) => {
    setGenre(value);
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onSelectMovie = (movie: AdaptedMovie) => () => {
    setSelectedMovie(movie);
    onOpen();
  };

  const onCloseCommentsModal = () => {
    onClose();
    setSelectedMovie(null);
  };

  return (
    <Center>
      <TableContainer w="full" maxW="80%">
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Year</Th>
              <Th>Runtime</Th>
              <Th>Revenue</Th>
              <Th>Rating</Th>
              <Th>Genres</Th>
            </Tr>

            <Tr>
              <Th>
                <Input
                  placeholder="Filter by title"
                  onChange={onChangeTitle}
                  value={title}
                />
              </Th>
              <Th />
              <Th />
              <Th />
              <Th />
              <Th>
                <Select
                  options={genres}
                  onChange={onGenreChange}
                  value={genre}
                />
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {movies.map(movie => (
              <Tr
                key={movie.title}
                _hover={{ bg: 'gray.200', cursor: 'pointer' }}
                onClick={onSelectMovie(movie)}
              >
                <Td>{movie.title}</Td>
                <Td>{movie.year}</Td>
                <Td>{movie.runtime}</Td>
                <Td>{movie.revenue}</Td>
                <Td>{movie.rating}</Td>
                <Td>{movie.genres}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <CommentsModal
        isOpen={isOpen}
        onClose={onCloseCommentsModal}
        movie={selectedMovie}
      />
    </Center>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const { query } = ctx;
  const { q, page, pageSize, genre } = query;

  const getMoviesPromise = getMovies({
    q: q ? String(q) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
    genre: genre ? String(genre) : undefined,
  });

  const [initialMovies, genres] = await Promise.all([
    getMoviesPromise,
    getGenres(),
  ]);

  return {
    props: {
      initialMovies: initialMovies.movies,
      totalPages: initialMovies.totalPages,
      genres,
    },
  };
};
