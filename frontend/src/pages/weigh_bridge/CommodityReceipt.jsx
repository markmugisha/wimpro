import { Container } from '@chakra-ui/layout';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import FirstMassForm from './commodity_receipt_items/FirstMassForm';
import CommodityReceiptForm from './commodity_receipt_items/CommodityReceiptForm';
import FirstMassTable from './commodity_receipt_items/FirstMassTable';
import SecondMassTable from './commodity_receipt_items/SecondMassTable';
import CommodityReceiptsTable from './commodity_receipt_items/CommodityReceiptsTable';

const CommodityReceipt = () => {
  return (
    <Container
      variant="outline"
      maxWidth="4xl"
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
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>First Mass</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Second Mass</Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Commodity Receipt
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <FirstMassTable />
          </TabPanel>

          <TabPanel>
            <SecondMassTable />
          </TabPanel>

          <TabPanel>
            <CommodityReceiptsTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
};
export default CommodityReceipt;
