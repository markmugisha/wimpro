import { Button } from '@chakra-ui/react';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import Table from '../../../components/Table';

const sampleData = [
  {
    batchNumber: 'A1B2C3D4',
    stackNumber: 1675958400000,
    Date: '2023-06-10',
  },
  {
    batchNumber: 'A1B2C3D4',
    stackNumber: 1675958400000,
    Date: '2023-06-10',
  },
  {
    batchNumber: 'A1B2C3D4',
    stackNumber: 1675958400000,
    Date: '2023-06-10',
  },
  {
    batchNumber: 'A1B2C3D4',
    stackNumber: 1675958400000,
    Date: '2023-06-10',
  },
];
const columnHelper = createColumnHelper();

const FumigationTable = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('batchNumber', {
        cell: (info) => info.getValue(),
        header: 'Batch Number',
      }),
      columnHelper.accessor('stackNumber', {
        cell: (info) => info.getValue(),
        header: 'Stack Number',
      }),
      columnHelper.accessor('Date', {
        cell: (info) => info.getValue(),
        header: 'Fumigation Date',
      }),

      columnHelper.display({
        id: 'actions',
        cell: () => {
          return (
            <Button variant="ghost" size="xs" fontSize={14} color="#fb8e19">
              View
            </Button>
          );
        },
        header: 'Details',
      }),
    ],
    []
  );
  return <Table columns={columns} data={sampleData}></Table>;
};
export default FumigationTable;
