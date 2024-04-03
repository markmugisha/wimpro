import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import Pending from './qa_pending_items/Pending';
import Assess from './qa_pending_items/Assess';
import ViewAssessed from './qa_pending_items/ViewAssessed';

const qaPending = () => {
  return (
    <Container
      variant="outline"
      maxWidth="4xl"
      py="2rem"
      m="1.5rem"
      bg="white"
      borderRadius="5px"
      fontFamily="Inter, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif"
      fontWeight="normal"
    >
      <Tabs mt="0px" p="0px" colorScheme="green" variant="enclosed">
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>Pending</Tab>

          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            View Assessed
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Pending />
          </TabPanel>

          <TabPanel>
            <ViewAssessed />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};
export default qaPending;
