import { useQuery } from 'react-query';
import { getSilos } from '../../../api/client';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import ChartModal from './ChartModal';
import { BsArrowsFullscreen } from 'react-icons/bs';

const formatSiloTotals = (siloTotals) => {
  return siloTotals.map(({ grainType, total }) => {
    return { name: grainType.name, value: Number(total) };
  });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#012461'];

function SiloTotals({ aspect }) {
  const silosQuery = useQuery(['silo-totals'], () =>
    getSilos().then(formatSiloTotals)
  );
  const disclosure = useDisclosure();

  const data = silosQuery.data;

  const renderChart = () => (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <PieChart style={{ fontSize: 13 }}>
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="35%"
          outerRadius="90%"
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
          focusable={false}
          style={{ outline: 'none' }}
        >
          {data.map((entry, index) => (
            <Cell
              style={{ outline: 'none' }}
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

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
      <Flex justifyContent="center" alignItems="center">
        <Heading size="sm" textAlign="center">
          Current Silo Inventory
        </Heading>
        {!disclosure.isOpen && (
          <IconButton
            icon={<BsArrowsFullscreen />}
            size="sm"
            variant="ghost"
            onClick={disclosure.onOpen}
          />
        )}
      </Flex>
    );
  }
}
export default SiloTotals;
