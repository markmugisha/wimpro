import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { createColumnHelper } from '@tanstack/react-table';
import {
  Card,
  CardBody,
  Spinner,
  Text,
} from '@chakra-ui/react';
// import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import Table from '../../../components/Table';
import { getUserAccounts } from '../../../api/client';

const columnHelper = createColumnHelper();

const UserAccounts = () => {
  const userAccountsQuery = useQuery(['user-account'], () => getUserAccounts());

  // const handleEditClick = (id) => {
  //   console.log(id);
  // };

  // const handleDeleteClick = (id) => {
  //   console.log(id);
  // };

  const columns = useMemo(
    () => [
      columnHelper.accessor(({ branch }) => branch?.name, {
        cell: (info) => info.getValue(),
        header: 'Branch Name',
      }),
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        header: 'First Name',
      }),
      columnHelper.accessor('lastName', {
        cell: (info) => info.getValue(),
        header: 'Last Name',
      }),
      columnHelper.accessor('phoneNumber', {
        cell: (info) => info.getValue(),
        header: 'Phone Number',
      }),
      columnHelper.accessor(({ roles }) => roles[0]?.name, {
        cell: (info) => info.getValue(),
        header: 'User Role',
      }),
      columnHelper.accessor('email', {
        cell: (info) => info.getValue(),
        header: 'Company Email',
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
      //           leftIcon={<AiFillDelete />}
      //           onClick={() => handleDeleteClick(row.lotId)}
      //         >
      //           Delete
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
      
          {userAccountsQuery.isLoading && <Spinner />}
          {userAccountsQuery.isSuccess && (
            <Table columns={columns} data={userAccountsQuery.data} />
          )}
          {userAccountsQuery.isError && (
            <Text>Failed to load User Accounts data</Text>
          )}
        
    </>
  );
};

export default UserAccounts;
