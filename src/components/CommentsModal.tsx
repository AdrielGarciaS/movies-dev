import {
  Avatar,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaArrowLeft } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from 'react';
import {
  createClientComment,
  getClientComments,
} from '../services/repositories/movie';

interface Props {
  isOpen: boolean;
  onClose(): void;
  movie: AdaptedMovie | null;
}

export const CommentsModal = (props: Props) => {
  const { isOpen, onClose, movie } = props;

  const [comments, setComments] = useState<AdaptedMovieComment[]>([]);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const movieComments = useMemo<AdaptedMovieComment[]>(() => {
    if (!movie) return [];

    return comments.filter(
      filterComment => filterComment.title === movie.title,
    );
  }, [movie, comments]);

  const hasNoComments = movieComments.length === 0;

  useEffect(() => {
    const loadComments = async () => {
      const data = await getClientComments();

      setComments(data);
    };

    loadComments();
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const onSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!movie) return;

    setIsLoading(true);

    const _comment = await createClientComment({
      title: movie.title,
      comment,
    });

    setComments(state => [...state, _comment]);
    setComment('');
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={HStack} bg="#404FB5" color="white">
          <IconButton
            aria-label="close comments modal"
            onClick={onClose}
            justifySelf="flex-start"
            bg="#404FB5"
            _hover={{
              bg: '#404FB5',
              filter: 'brightness(0.8)',
            }}
          >
            <Icon as={FaArrowLeft} />
          </IconButton>

          <Text>{movie?.title} Comments</Text>
        </ModalHeader>

        <ModalBody py="2rem" bg="gray.100" minH="20rem">
          <VStack spacing="1.5rem" w="full">
            {hasNoComments && (
              <Center h="full" w="full">
                <Text>This movie has no comments yet 😕</Text>
              </Center>
            )}

            {movieComments.map(movieComment => (
              <HStack w="full" key={movieComment.id}>
                <Avatar
                  src="https://i.pravatar.cc/300/"
                  bg="#404FB5"
                  h="2.5rem"
                  w="2.5rem"
                />

                <Text
                  bg="#404FB5"
                  w="full"
                  h="full"
                  px="0.5rem"
                  lineHeight="2.5rem"
                  color="white"
                >
                  {movieComment.comment}
                </Text>
              </HStack>
            ))}
          </VStack>
        </ModalBody>

        <ModalFooter as="form" w="full" onSubmit={onSubmit}>
          <HStack w="full">
            <Input
              onChange={onChange}
              value={comment}
              w="full"
              disabled={isLoading}
            />

            <IconButton
              aria-label="submit comment"
              type="submit"
              bg="#404FB5"
              rounded="full"
              isLoading={isLoading}
              _hover={{
                bg: '#404FB5',
                filter: 'brightness(0.8)',
              }}
            >
              <Icon as={IoMdSend} fontSize="1.25rem" color="white" />
            </IconButton>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
