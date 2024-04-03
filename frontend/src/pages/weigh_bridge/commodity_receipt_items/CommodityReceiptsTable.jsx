import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import {
  getCommodityReceipts,
  getPendingSecondMass,
} from '../../../api/client';
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
import CommodityReceiptPrintout from './CommodityReceiptPrintout';

const columnHelper = createColumnHelper();

const CommodityReceiptsTable = () => {
  const [currentRow, setCurrentRow] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const secondMassQuery = useQuery(['commodity-receipts'], () =>
    getCommodityReceipts()
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
      columnHelper.accessor(
        ({ receivedProduct: { grainType } }) => grainType.name,
        {
          cell: (info) => info.getValue(),
          header: 'Grain Type',
        }
      ),
      columnHelper.accessor(
        ({ receivedProduct: { supplier } }) => supplier.name,
        {
          cell: (info) => info.getValue(),
          header: 'Supplier',
        }
      ),
      columnHelper.accessor('firstMass', {
        cell: (info) => info.getValue(),
        header: 'First Mass',
      }),
      columnHelper.accessor('secondMass', {
        cell: (info) => info.getValue(),
        header: 'Second Mass',
      }),
      columnHelper.accessor('grossWeight', {
        cell: (info) => info.getValue(),
        header: 'Gross Weight',
      }),
      columnHelper.accessor('deductions', {
        cell: (info) => info.getValue(),
        header: 'Deductions',
      }),
      columnHelper.accessor('netWeight', {
        cell: (info) => info.getValue(),
        header: 'Net Weight',
      }),
      columnHelper.display({
        header: 'Actions',
        cell: ({ row: { original: row } }) => {
          return (
            <HStack spacing={2}>
              <Button
                variant="ghost"
                size="xs"
                fontSize={14}
                color="#fb8e19"
                onClick={() => handleSecondMassClick(row)}
              >
                Print
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

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton bg="white" />
          <ModalBody p={0} bg="white">
            <CommodityReceiptPrintout commodityReceipt={currentRow} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CommodityReceiptsTable;
