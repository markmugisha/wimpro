import { useQuery } from 'react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Spinner, Text } from '@chakra-ui/react';
import Table from '../../../components/Table';
import { getDailyProduction } from '../../../api/client';
import dayjs from 'dayjs';
const columnHelper = createColumnHelper();

const ProductionTable = () => {
  const dailyProductionQuery = useQuery(['daily-production'], () =>
    getDailyProduction()
  );
  const columns = [
    columnHelper.accessor('productionDate', {
      cell: (info) => dayjs(info.getValue()).format('DD-MM-YY'),
      header: 'Date',
    }),
    columnHelper.accessor('batchNumber', {
      cell: (info) => info.getValue(),
      header: 'Batch No',
    }),
    columnHelper.accessor(({ grainType }) => grainType.name, {
      cell: (info) => info.getValue(),
      header: 'Grain Type',
    }),
    columnHelper.accessor('averageMoistureContent', {
      cell: (info) => info.getValue(),
      header: 'Avg MC',
    }),
    columnHelper.accessor('numberOfBags', {
      cell: (info) => info.getValue(),
      header: 'No of Bags',
    }),
    columnHelper.accessor('weightPerBag', {
      cell: (info) => info.getValue(),
      header: 'Weight per Bag',
    }),
    columnHelper.accessor('totalWeight', {
      cell: (info) => info.getValue(),
      header: 'Total Weight',
    }),
  ];
  return (
    <>
      {dailyProductionQuery.isLoading && <Spinner />}
      {dailyProductionQuery.isSuccess && (
        <Table columns={columns} data={dailyProductionQuery.data} />
      )}
      {dailyProductionQuery.isError && <Text>Failed to load data</Text>}
    </>
  );
};
export default ProductionTable;
