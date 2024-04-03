import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import UserAccounts from './user_items/UserAccounts';
import NewUser from './user_items/NewUser';

function Users() {
  return (
    <Container
      variant="outline"
      maxWidth="5xl"
      py="2rem"
      m="1.5rem"
      bg="white"
      borderRadius="5px"
      fontFamily="Inter, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
      // fontSize="14px"
      fontWeight="normal"
    >
      {/* <CardBody> */}
      <Tabs mt="0px" p="0px" colorScheme="green" variant="enclosed">
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Users Accounts
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Add New User
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UserAccounts />
          </TabPanel>

          <TabPanel>
            <NewUser />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
}
export default Users;
