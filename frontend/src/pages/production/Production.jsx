import { Container } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
// import ProductionForm from './production_items/ProductionForm';
import ProductionTable from './production_items/ProductionTable';
import Batches from './production_items/Batches';

const Production = () => {
  return (
    <Container
      variant="outline"
      maxWidth="5xl"
      // py="2rem"
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
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Production</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Add New Production</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ProductionTable />
          </TabPanel>

          <TabPanel>
            <Batches />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
};
export default Production;
