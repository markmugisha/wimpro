import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { getReceivedProduceTrends } from '../../../api/client';
import { getRandomRGB } from './utils';
import { Box, Flex, Heading, IconButton, Select, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import ChartModal from './ChartModal';
import { BsArrowsFullscreen } from 'react-icons/bs';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const formatReceivedProduceTrends = (data) => {
  const formatted = months.map((month) => ({ name: month }));

  /**
   * [
   *  {
   *    name: 'January,
   *    Peas: 23054.56,
   *    Bea
   *  },
   * ]
   */

  data.forEach((entry) => {
    formatted[entry.month - 1][entry.grainTypeName] = entry.totalNetWeight;
  });

  return formatted;
};

function ReceivedProduceTrends({ aspect }) {
  const [year, setYear] = useState(2024);
  const disclosure = useDisclosure();

  const receivedProduceTrendsQuery = useQuery(
    ['received-produce-trends', year],
    () => getReceivedProduceTrends(year).then(formatReceivedProduceTrends)
  );

  const data = receivedProduceTrendsQuery.data;

  const grainTypes = Array.from(
    new Set(
      data?.flatMap((entry) => {
        return Object.keys(entry).filter((key) => key !== 'name');
      })
    )
  );

  return (
    <>
      <Box>
        {renderChartHeader()}
        {data && renderChart()}
        <ChartModal disclosure={disclosure}>
          {renderChartHeader()}
          {data && renderChart()}
        </ChartModal>
      </Box>
    </>
  );

  function renderChartHeader() {
    return (
      <Flex justifyContent="center" alignItems="center" gap={2}>
        <Heading display='flex' size="sm" textAlign="center" alignItems='center'>
          Received Produce Trends
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

  function renderChart() {
    return (
      <ResponsiveContainer width="100%" aspect={aspect}>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 17,
            right: 10,
            bottom: 5,
          }}
          style={{ fontSize: 14 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickCount={10} />
          <Tooltip />
          <Legend />
          {grainTypes.map((grainType) => (
            <Line
              key={grainType}
              type="monotone"
              dataKey={grainType}
              stroke={getRandomRGB()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
export default ReceivedProduceTrends;
