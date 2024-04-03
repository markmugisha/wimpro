import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import { getPendingSecondMass } from '../../../api/client';
import { useMemo, useState } from 'react';
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
import SecondMassForm from './SecondMassForm';

const columnHelper = createColumnHelper();

const SecondMassTable = () => {
  const [currentRow, setCurrentRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const secondMassQuery = useQuery(['pending-second-mass'], () =>
    getPendingSecondMass()
  );

  const handleSecondMassClick = (row) => {
    setCurrentRow(row);
    onOpen();
  };

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
      columnHelper.accessor(
        ({ commodityReceipt }) => commodityReceipt.firstMass,
        {
          cell: (info) => info.getValue(),
          header: 'First Mass',
        }
      ),
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
                onClick={() => handleSecondMassClick(row)}
              >
                Second Mass
              </Button>
            </HStack>
          );
        },
      }),
    ],
    []
  );
  return (
    <>
      {secondMassQuery.isLoading && <Spinner />}
      {secondMassQuery.isSuccess && (
        <Table columns={columns} data={secondMassQuery.data} />
      )}
      {secondMassQuery.isError && <Text>Failed to load data</Text>}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton bg="white" />
          <ModalBody p={0}>
            <SecondMassForm row={currentRow} onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SecondMassTable;
