import {
  Avatar,
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

interface Props {
  isOpen: boolean;
  onClose(): void;
  movie: AdaptedMovie | null;
}

export const CommentsModal = (props: Props) => {
  const { isOpen, onClose, movie } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as={HStack} bg="#404FB5" color="white">
          <IconButton
            aria-label="close comments modal"
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
            <HStack w="full">
              <Avatar bg="#404FB5" h="2.5rem" w="2.5rem" />

              <Text
                bg="#404FB5"
                w="full"
                h="full"
                px="0.5rem"
                lineHeight="2.5rem"
                color="white"
              >
                I hate it
              </Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter as={HStack} w="full">
          <Input />

          <IconButton
            aria-label="submit comment"
            bg="#404FB5"
            rounded="full"
            _hover={{
              bg: '#404FB5',
              filter: 'brightness(0.8)',
            }}
          >
            <Icon as={IoMdSend} fontSize="1.25rem" color="white" />
          </IconButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
