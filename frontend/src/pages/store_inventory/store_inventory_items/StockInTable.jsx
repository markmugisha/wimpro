import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '../../../components/Table';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import { getStockIn } from '../../../api/client';
import ReceiveStock from './ReceiveStockForm';
import { useCallback, useMemo, useState } from 'react';

const columnHelper = createColumnHelper();

const StockIn = () => {
  const [currentRow, setCurrentRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const stockInQuery = useQuery(['stock-in'], () => getStockIn());

  const handleReceivedStockClick = useCallback(
    (row) => {
      setCurrentRow(row);
      onOpen();
    },
    [onOpen]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('batchNumber', {
        cell: (info) => info.getValue(),
        header: 'Batch Number',
      }),
      columnHelper.accessor(({ grainType }) => grainType.name, {
        cell: (info) => info.getValue(),
        header: 'Grain Type',
      }),
      columnHelper.accessor('weightPerBag', {
        cell: (info) => info.getValue(),
        header: 'Weight Per Bag',
      }),
      columnHelper.accessor('numberOfBags', {
        cell: (info) => info.getValue(),
        header: 'Number of Bags',
      }),
      columnHelper.accessor('averageMoistureContent', {
        cell: (info) => info.getValue(),
        header: 'AV MC',
      }),
      columnHelper.display({
        id: 'actions',
        cell: ({ row: { original: row } }) => {
          return row.status === 'produced' && (
            <Button
              variant="ghost"
              size="xs"
              fontSize={14}
              color="#fb8e19"
              onClick={() => handleReceivedStockClick(row)}
            >
              Receive Stock
            </Button>
          );
        },
        header: 'Receive',
      }),
    ],
    [handleReceivedStockClick]
  );

  return (
    <>
      {/* <Table columns={columns} data={sampleData}></Table> */}

      {stockInQuery.isLoading && <Spinner />}
      {stockInQuery.isSuccess && (
        <Table columns={columns} data={stockInQuery.data}></Table>
      )}
      {stockInQuery.isError && <Text>Failed to load stock inventory</Text>}

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton bg="white" />
          <ModalBody p={0}>
            <ReceiveStock stock={currentRow} onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default StockIn;
