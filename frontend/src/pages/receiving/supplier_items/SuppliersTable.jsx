import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Spinner, Text } from '@chakra-ui/react';

import Table from '../../../components/Table';
import { getSuppliers } from '../../../api/client'; 

const columnHelper = createColumnHelper();

const SuppliersTable = () => {

  const supplierQuery = useQuery(['suppliers'], () =>
    getSuppliers()
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        cell: (info) => info.getValue(),
        header: 'Supplier',
      }),
      columnHelper.accessor('phoneNumber', {
        cell: (info) => info.getValue(),
        header: 'Phone Number',
      }),
      columnHelper.accessor('email', {
        cell: (info) => info.getValue(),
        header: 'Email',
      }),
      columnHelper.accessor('dateCreated', {
        cell: (info) => dayjs(info.getValue()).format('MMM DD, YYYY h:mma'),
        header: 'Registration',
      }),
    ],
    []
  );

  return (
    <>
      {supplierQuery.isLoading && <Spinner />}
      {supplierQuery.isSuccess && (
        <Table columns={columns} data={supplierQuery.data} />
      )}
      {supplierQuery.isError && <Text>Failed to load data</Text>}
    </>
  );
};

export default SuppliersTable;
