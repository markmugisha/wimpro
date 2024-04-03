import { Container } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import StockOut from './store_inventory_items/StockOutTable';
import StockIn from './store_inventory_items/StockInTable';
import StockTable from './store_inventory_items/StockTable';
import FumigationTable from './store_inventory_items/FumigationTable';
import PendingOrderTable from './store_inventory_items/PendingOrderTable';

const Manage_stock = () => {
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
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Stock In</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Stock</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Stock Out</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Pending Orders</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Fumigation</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <StockIn />
          </TabPanel>

          <TabPanel>
            <StockTable />
          </TabPanel>

          <TabPanel>
            <StockOut />
          </TabPanel>

          <TabPanel>
            <PendingOrderTable />
          </TabPanel>

          <TabPanel>
            <FumigationTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
};
export default Manage_stock;
