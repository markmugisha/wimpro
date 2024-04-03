import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import { getPendingFirstMass } from '../../../api/client';
import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Table from '../../../components/Table';
import FirstMassForm from './FirstMassForm';

const columnHelper = createColumnHelper();
const FirstMassTable = () => {
  const [currentRow, setCurrentRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const firstMassQuery = useQuery(['pending-first-mass'], () =>
    getPendingFirstMass()
  );

  const handleFirstMassClick = useCallback(
    (row) => {
      setCurrentRow(row);
      onOpen();
    },
    [onOpen]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('lotId', {
        cell: (info) => info.getValue(),
        header: 'LOT ID',
      }),
      columnHelper.accessor(({ grainType }) => grainType.name, {
        cell: (info) => info.getValue(),
        header: 'Grain Type',
      }),
      columnHelper.accessor(({ supplier }) => supplier.name, {
        cell: (info) => info.getValue(),
        header: 'Supplier',
      }),
      columnHelper.display({
        header: 'Add Weight',
        cell: ({ row: { original: row } }) => {
          return (
            <HStack spacing={2}>
              <Button
                variant="ghost"
                size="xs"
                fontSize={14}
                color="#fb8e19"
                // leftIcon={<AiFillEdit />}
                onClick={() => handleFirstMassClick(row)}
              >
                First Mass
              </Button>
            </HStack>
          );
        },
      }),
    ],
    [handleFirstMassClick]
  );
  return (
    <>
      {firstMassQuery.isLoading && <Spinner />}
      {firstMassQuery.isSuccess && (
        <Table columns={columns} data={firstMassQuery.data} />
      )}
      {firstMassQuery.isError && <Text>Failed to load data</Text>}

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton bg="white" />
          <ModalBody p={0}>
            <FirstMassForm row={currentRow} onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default FirstMassTable;
