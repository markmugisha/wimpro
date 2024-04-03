import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import { getPendingOrders } from '../../../api/client';
import dayjs from 'dayjs';
import Table from '../../../components/Table';
import { Button, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import OrderPickingPlan from './OrderPickingPlan';

const columnHelper = createColumnHelper();

const PendingOrderTable = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const disclosure = useDisclosure();

  const orderQuery = useQuery(['pending-orders'], () => getPendingOrders());

  const columns = [
    columnHelper.accessor('productionDate', {
      cell: (info) => dayjs(info.getValue()).format('DD-MM-YY'),
      header: 'Date',
    }),
    columnHelper.accessor('customerName', {
      cell: (info) => info.getValue(),
      header: 'Customer Name',
    }),
    columnHelper.accessor('email', {
      cell: (info) => info.getValue(),
      header: 'Customer Email',
    }),
    columnHelper.accessor('phoneNumber', {
      cell: (info) => info.getValue(),
      header: 'phoneNumber',
    }),
    columnHelper.accessor('dispatchType', {
      cell: (info) => info.getValue(),
      header: 'Dispatch Type',
    }),
    columnHelper.accessor('invoiceNumber', {
      cell: (info) => info.getValue(),
      header: 'Invoice Number',
    }),
    columnHelper.accessor('receiptNumber', {
      cell: (info) => info.getValue(),
      header: 'Receipt Number',
    }),
    columnHelper.accessor('payment', {
      cell: (info) => info.getValue(),
      header: 'Payment',
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row: { original: row } }) => {
        return (
          <Button
            variant="ghost"
            size="xs"
            fontSize={14}
            color="#fb8e19"
            onClick={() => {
              setCurrentOrder(row);
              disclosure.onOpen();
            }}
          >
            Pick Order
          </Button>
        );
      },
    }),
  ];

  return (
    <>
      {orderQuery.isLoading && <Spinner />}
      {orderQuery.isSuccess && (
        <Table columns={columns} data={orderQuery.data} />
      )}
      {orderQuery.isError && <Text>Failed to load data</Text>}
      {currentOrder && (
        <OrderPickingPlan order={currentOrder} disclosure={disclosure} />
      )}
    </>
  );
};
export default PendingOrderTable;
