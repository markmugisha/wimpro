import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import { getPendingSecondMass } from '../../../api/client';
import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import Table from '../../../components/Table';
import EditAssessed from './EditAssessed';

const columnHelper = createColumnHelper();

const ViewAssessed = () => {
  const [currentRow, setCurrentRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const pendingQAQuery = useQuery(['pending-second-mass'], () =>
    getPendingSecondMass()
  );

  const handleAssessClick = useCallback(
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
      columnHelper.accessor(
        ({ commodityReceipt }) => commodityReceipt.firstMass,
        {
          cell: (info) => info.getValue(),
          header: 'First Mass',
        }
      ),
      columnHelper.display({
        header: 'Assess',
        cell: ({ row: { original: row } }) => {
          return (
            <HStack spacing={2}>
              <Button
                variant="ghost"
                size="xs"
                fontSize={14}
                color="#fb8e19"
                onClick={() => handleAssessClick(row)}
              >
                Edit
              </Button>
            </HStack>
          );
        },
      }),
    ],
    [handleAssessClick]
  );
  return (
    <>
      {pendingQAQuery.isLoading && <Spinner />}
      {pendingQAQuery.isSuccess && (
        <Table columns={columns} data={pendingQAQuery.data} />
      )}
      {pendingQAQuery.isError && <Text>Failed to load data</Text>}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton bg="white" />
          <ModalBody p={0}>
            <EditAssessed row={currentRow} onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ViewAssessed;
