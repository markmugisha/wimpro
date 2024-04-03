import { Box, Heading, IconButton, SimpleGrid } from '@chakra-ui/react';
import { AiOutlineLink } from 'react-icons/ai';

import ReceivedProduceTrends from './charts/ReceivedProduceTrends';
import SiloTotals from './charts/SiloTotals';
import ReceivedVsProducedTrend from './charts/ReceivedVsProduceTrend';
import ProductionTrends from './charts/ProductionTrends';
import { useEffect, useRef, useState } from 'react';

const chartAspectRatio = 2;
function CentralDashboard() {
  return (
    <SimpleGrid columns={{ md: 2 }} w="full" h="max-content" gap={2} p={2}>
      <DashboardChart
        title="Received Produce Trends"
        chart={<ReceivedProduceTrends aspect={chartAspectRatio} />}
      />
      <DashboardChart
        title="Silo Inventory"
        chart={<SiloTotals aspect={chartAspectRatio} />}
      />
      <DashboardChart
        title="Received vs Produced Trend"
        chart={<ReceivedVsProducedTrend aspect={chartAspectRatio} />}
      />

      <DashboardChart chart={<ProductionTrends aspect={chartAspectRatio} />} />
    </SimpleGrid>
  );
}

function DashboardChart({ chart }) {
  return (
    <Box
      overflowX="hidden"
      overflowY="hidden"
      h="full"
    >
      {chart}
    </Box>
  );
}

export default CentralDashboard;
