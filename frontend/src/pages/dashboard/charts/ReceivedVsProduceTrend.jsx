import { useQuery } from 'react-query';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from 'recharts';

import { getReceivedVsProducedTrend } from '../../../api/client';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import ChartModal from './ChartModal';
import { BsArrowsFullscreen } from 'react-icons/bs';

function ReceivedVsProducedTrend({ aspect }) {
  const [year, setYear] = useState(2024);
  const disclosure = useDisclosure();

  const receivedProduceTrendsQuery = useQuery(
    ['received-vs-produced-trend', year],
    () => getReceivedVsProducedTrend(year)
  );

  const data = receivedProduceTrendsQuery.data;

  const renderChart = () => (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <BarChart
        width={500}
        height={300}
        data={data.data}
        margin={{
          top: 17,
          right: 10,
          bottom: 5,
        }}
        style={{ fontSize: 14 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend
          payload={[
            { value: 'Produced', color: '#8884d8' },
            { value: 'Received', color: '#82ca9d' },
          ]}
        />
        {Object.keys(data.keys).map((dataKey) => (
          <Bar
            key={dataKey}
            dataKey={dataKey}
            stackId={data.keys[dataKey]}
            fill={dataKey.endsWith('Produced') ? '#8884d8' : '#82ca9d'}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Box>
      {renderChartHeader()}
      {data && renderChart()}
      <ChartModal disclosure={disclosure}>
        {renderChartHeader()}
        {data && renderChart()}
      </ChartModal>
    </Box>
  );

  function renderChartHeader() {
    return (
      <Flex justifyContent="center" alignItems="center" gap={2}>
        <Heading
          size="sm"
          textAlign="center"
        >
          Received vs Produced Trend
        </Heading>
        <Select
          w="unset"
          size="xs"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          fontWeight="semibold"
          borderColor="gray.400"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </Select>
        {!disclosure.isOpen && <IconButton icon={<BsArrowsFullscreen />} size='sm' variant='ghost'  onClick={disclosure.onOpen} />}
      </Flex>
    );
  }
}
export default ReceivedVsProducedTrend;
