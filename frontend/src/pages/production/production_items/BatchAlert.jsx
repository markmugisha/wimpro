import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useRef } from 'react';

function BatchAlert({ disclosure, onOK }) {
  const { isOpen, onClose } = disclosure;
  const cancelRef = useRef();

  const handleOnOK = () => {
    onClose();
    onOK();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered={true}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="md" fontWeight="semibold">
            Note
          </AlertDialogHeader>

          <AlertDialogBody>
            Current active batch will be closed and you will no longer be able
            to add to it.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Flex gap={5}>
              <Button ref={cancelRef} onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button onClick={handleOnOK} size="sm">
                OK
              </Button>
            </Flex>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
export default BatchAlert;
