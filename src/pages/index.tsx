import {
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';
import { GetServerSideProps } from 'next';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Select } from 'components/Select';

import { getGenres, getMovies } from 'server/repositories/movie';
import { getClientMovies } from 'services/repositories/movie';
import { CommentsModal } from 'components/CommentsModal';

const registersPerPageOptions = ['20', '50', '100'];

interface Props {
  initialMovies: AdaptedMovie[];
  totalRegisters: number;
  genres: string[];
}

const Home = (props: Props) => {
  const { initialMovies, totalRegisters, genres } = props;

  const [movies, setMovies] = useState(initialMovies);
  const [selectedMovie, setSelectedMovie] = useState<AdaptedMovie | null>(null);
  const [genre, setGenre] = useState('');
  const [title, setTitle] = useState('');
  const [perPage, setPerPage] = useState('20');

  const [debouncedTitle] = useDebounce(title, 300);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  const loadMovies = async (q?: string) => {
    const _perPage = perPage === '' ? totalRegisters : Number(perPage);

    const data = await getClientMovies({ q, genre, pageSize: _perPage });

    setMovies(data.movies);
  };

  useEffect(() => {
    loadMovies(debouncedTitle);
  }, [debouncedTitle, genre, perPage]);

  useEffect(() => {
    const query: Record<string, string> = {};

    if (genre) query.genre = genre;

    if (debouncedTitle) query.q = debouncedTitle;

    if (perPage) query.perPage = perPage;

    router.push('/', { query }, { shallow: true });
  }, [debouncedTitle, genre, perPage]);

  useEffect(() => {
    const { query } = router;

    if (!query.genre && !query.q) return;

    setGenre((query.genre ?? '') as string);
    setTitle((query.q ?? '') as string);
    setPerPage((query.perPage ?? '') as string);
  }, []);

  const onGenreChange = (value: string) => {
    setGenre(value);
  };

  const onPerPageChange = (value: string) => {
    setPerPage(value);
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
    <VStack pb="3rem">
      <HStack>
        <Text whiteSpace="nowrap">Registers per page:</Text>

        <Select
          options={registersPerPageOptions}
          value={perPage}
          onChange={onPerPageChange}
        />
      </HStack>

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
    </VStack>
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
      totalRegisters: initialMovies.totalRegisters,
      genres,
    },
  };
};
