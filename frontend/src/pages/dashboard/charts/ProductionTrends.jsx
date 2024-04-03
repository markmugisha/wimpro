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

import { getProductionTrends } from '../../../api/client';
import { getRandomRGB } from './utils';
import { Box, Flex, Heading, IconButton, Select, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import ChartModal from './ChartModal';
import { BsArrowsFullscreen } from 'react-icons/bs';

function ProductionTrends({ aspect }) {
  const [year, setYear] = useState(2024);
  const disclosure = useDisclosure();

  const productionTrendsQuery = useQuery(['production-trends', year], () =>
    getProductionTrends(year)
  );

  const data = productionTrendsQuery.data;

  return (
    <Box>
      {renderChartHeader()}
      {data && !disclosure.isOpen && renderChart()}
      <ChartModal disclosure={disclosure}>
        {renderChartHeader()}
        {data && renderChart()}
      </ChartModal>
    </Box>
  );

  function renderChartHeader() {
    return (
      <Flex justifyContent="center" gap={2} alignItems="center">
        <Heading
          size="sm"
          textAlign="center"
        >
          Production Trends
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
          <YAxis tickCount={10} />
          <Tooltip />
          <Legend />
          {data.keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={getRandomRGB()}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
export default ProductionTrends;
