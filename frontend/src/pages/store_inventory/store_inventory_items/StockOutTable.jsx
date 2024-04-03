import { IconButton } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";
import Table from '../../../components/Table';
import dayjs from "dayjs";
import { AiFillEdit, AiFillFile } from "react-icons/ai";
import { useMemo } from "react";

// import { getStockOut } from "../../../api/client";
// import { useQuery } from "react-query";

const columnHelper = createColumnHelper();

const sampleData = [
  {
    salesOrderNumber: 4123,
    date: '01/04/23',
    quantity: '1000 Kg',
    approvedBy: 'Fauzia Naava',
    pickingStatus: 'Closed',    
  }
];

const StockOut = () => {

  // const stockOutQuery = useQuery(['stock-out'], () =>
  //   getStockOut()
  // );

  const columns = useMemo(() => [
    columnHelper.accessor('salesOrderNumber', {
      cell: (info) => info.getValue(),
      header: 'salesOrderNumber',
    }),
    columnHelper.accessor('date', {
      cell: (info) => dayjs(info.getValue()).format('DD-MM-YY'),
      header: 'Date',
    }),
    columnHelper.accessor('quantity', {
      cell: (info) => info.getValue(),
      header: 'Quantity',
    }),
    columnHelper.accessor('approvedBy', {
      cell: (info) => info.getValue(),
      header: 'approvedBy',
    }),
    columnHelper.accessor('pickingStatus', {
      cell: (info) => info.getValue(),
      header: 'Picking Status',
    }),
    columnHelper.display({
      id: 'details action',
      cell: () => {
        return (
          <IconButton
            variant="ghost"
            size="xs"
            fontSize={14}
            color="#fb8e19"
            leftIcon={<AiFillEdit />}
          />
          
        );
      },
      header: 'View Details',
    }),
    columnHelper.display({
      id: 'picking action',
      cell: () => {
        return (
          <IconButton
            variant="ghost"
            size="xs"
            fontSize={14}
            color="#fb8e19"
            leftIcon={<AiFillFile />}
          />
          
        );
      },
      header: 'Picking Guide',
    }),
    columnHelper.display({
      id: 'dispatch action',
      cell: () => {
        return (
          <IconButton
            variant="ghost"
            size="xs"
            fontSize={14}
            color="#fb8e19"
            leftIcon={<AiFillFile />}
          />
          
        );
      },
      header: 'Dispatch Note',
    }),
  ],
    []
  );
  
  return (
    <>
      <Table columns={columns} data={sampleData}></Table>

      {/* {stockOutQuery.isLoading && <Spinner />}
      {stockOutQuery.isSuccess && (
        <Table columns={columns} data={stockOutQuery.data}></Table>      )}
      {stockOutQuery.isError && <Text>Failed to load stock inventory</Text>} */}

    </>
  );
};
export default StockOut;
