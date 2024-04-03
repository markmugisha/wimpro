import { createColumnHelper } from '@tanstack/react-table';
import { useQuery } from 'react-query';
import { getOrders } from '../../../api/client';
import dayjs from 'dayjs';
import Table from '../../../components/Table';
import { Spinner, Text } from '@chakra-ui/react';

const columnHelper = createColumnHelper();

const SalesOrderTable = () => {
  const orderQuery = useQuery(['orders'], () => getOrders());

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
    columnHelper.accessor(({ orderItems }) => orderItems[0].grainType.name, {
      cell: (info) => info.getValue(),
      header: 'Grain Type',
    }),
    columnHelper.accessor(({ orderItems }) => orderItems[0].numberOfBags, {
      cell: (info) => info.getValue(),
      header: 'Number of Bags',
    }),
    columnHelper.accessor(({ orderItems }) => orderItems[0].weightPerBag, {
      cell: (info) => info.getValue(),
      header: 'Weight per Bag',
    }),
    columnHelper.accessor(({ orderItems }) => orderItems[0].totalWeight, {
      cell: (info) => info.getValue(),
      header: 'Total Weight',
    }),
  ];

  return (
    <>
      {orderQuery.isLoading && <Spinner />}
      {orderQuery.isSuccess && (
        <Table columns={columns} data={orderQuery.data} />
      )}
      {orderQuery.isError && <Text>Failed to load data</Text>}
    </>
  );
};
export default SalesOrderTable;
