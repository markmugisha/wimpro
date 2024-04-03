import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { createColumnHelper } from '@tanstack/react-table';
import { Spinner, Text } from '@chakra-ui/react';
// import { AiFillEdit, AiFillPrinter } from 'react-icons/ai';

import Table from '../../../components/Table';
import { getReceivedProduce } from '../../../api/client';

const columnHelper = createColumnHelper();

const ReceivedProduceTable = () => {
  const receivedProduceQuery = useQuery(['received-produce'], () =>
    getReceivedProduce()
  );

  // const handleEditClick = (id) => {
  //   console.log(id);
  // };

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
      // columnHelper.accessor('productSupplyType', {
      //   cell: (info) => (
      //     <Tag textTransform="uppercase" size="sm" variant="outline">
      //       {info.getValue()}
      //     </Tag>
      //   ),
      //   header: 'Supply Type',
      // }),
      columnHelper.accessor(({ supplier }) => supplier.name, {
        cell: (info) => info.getValue(),
        header: 'Supplier',
      }),
      columnHelper.accessor('dateCreated', {
        cell: (info) => dayjs(info.getValue()).format('MMM DD, YYYY h:mma'),
        header: 'Date Received',
      }),
      // columnHelper.display({
      //   id: 'actions',
      //   cell: ({ row: { original: row } }) => {
      //     return (
      //       <HStack spacing={2}>
      //         <Button
      //           variant="ghost"
      //           size="xs"
      //           fontSize={14}
      //           color="#fb8e19"
      //           leftIcon={<AiFillEdit />}
      //           onClick={() => handleEditClick(row.lotId)}
      //         >
      //           Edit
      //         </Button>
      //         <Button
      //           variant="ghost"
      //           size="xs"
      //           fontSize={14}
      //           color="#fb8e19"
      //           leftIcon={<AiFillPrinter />}
      //           onClick={() =>
      //             console.log(
      //               'relax, no printing enabled yet. sketch it if you want it'
      //             )
      //           }
      //         >
      //           Print
      //         </Button>
      //       </HStack>
      //     );
      //   },
      // }),
    ],
    []
  );

  return (
    <>
      {receivedProduceQuery.isLoading && <Spinner />}
      {receivedProduceQuery.isSuccess && (
        <Table columns={columns} data={receivedProduceQuery.data} />
      )}
      {receivedProduceQuery.isError && <Text>Failed to load data</Text>}
    </>
  );
};

export default ReceivedProduceTable;
