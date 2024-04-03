import { Container } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import SalesOrderForm from './sales_items/SalesOrderForm';
import SalesOrderTable from './sales_items/SalesOrderTable';
import OrderApprovalTable from './sales_items/OrderApprovalTable';

const Sales = () => {
  return (
    <Container
      variant="outline"
      maxWidth="5xl"
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
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Order list</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>New order</Tab>
          {/* <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Approve Sales
          </Tab> */}
        </TabList>

        <TabPanels>
          <TabPanel>
            <SalesOrderTable />
          </TabPanel>

          <TabPanel>
            <SalesOrderForm />
          </TabPanel>
          <TabPanel>
            <OrderApprovalTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
};
export default Sales;
