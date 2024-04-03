import {
  // Box,
  // CloseButton,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import ReceivedProduceTable from './received_produce_items/ReceivedProduceTable';
import ReceivedProduceForm from './received_produce_items/ReceivingProduceForm';
import { useState } from 'react';
import GrainTypeForm from './received_produce_items/GrainTypeForm';

const ReceivedProduce = () => {
  // const [historyTabId, setHistoryTabId] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };
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
      <Tabs
        index={tabIndex}
        onChange={handleTabsChange}
        mt="0px"
        p="0px"
        colorScheme="green"
        variant="enclosed"
      >
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Received Produce Table
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            Receive Produce Form
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'green.500' }}>
            New Grain Type
          </Tab>
          {/* {historyTabId && (
            <Tab _selected={{ color: 'white', bg: 'green.500' }}>
              History for: {historyTabId}
              <CloseButton
                onClick={() => {
                  setHistoryTabId(null);
                  setTabIndex(0);
                }}
              />
            </Tab>
          )} */}
        </TabList>

        <TabPanels>
          <TabPanel>
            <ReceivedProduceTable
              // onHistoryClick={(id) => {
              //   setHistoryTabId(id);
              //   setTabIndex(2);
              // }}
            />
          </TabPanel>

          <TabPanel>
            <ReceivedProduceForm />
          </TabPanel>
          <TabPanel>
            <GrainTypeForm />
          </TabPanel>
          {/* {historyTabId && (
            <TabPanel>
              <Box>This is History for {historyTabId}</Box>
            </TabPanel>
          )} */}
        </TabPanels>
      </Tabs>
      {/* </CardBody> */}
    </Container>
  );
};
export default ReceivedProduce;
