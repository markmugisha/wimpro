import { useQuery } from 'react-query';
import { getBatches } from '../../../api/client';
import {
  Button,
  Flex,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import CreateBatchForm from './CreateBatchForm';
import ProductionForm from './ProductionForm';
import { useState } from 'react';

function Batches() {

  const [currentBatch, setCurrentBatch] = useState(null);

  const batchFormDisclosure = useDisclosure();
  const productionFormDisclosure = useDisclosure();

  const batchesQuery = useQuery(['batches'], () => getBatches());

  const handleBatchClick = (batch) => {
    setCurrentBatch(batch);
    productionFormDisclosure.onOpen();
  }

  return (
    <>
      <Flex justifyContent="flex-end">
        <Button onClick={batchFormDisclosure.onOpen}>Create Batch</Button>
        <CreateBatchForm disclosure={batchFormDisclosure} />
      </Flex>
      {batchesQuery.isLoading && <Spinner />}
      {batchesQuery.isSuccess && (
        <Flex flexDir='column' gap={3} >
          {currentBatch && <ProductionForm disclosure={productionFormDisclosure} batch={currentBatch} />}
          {batchesQuery.data.map((batch) => (
            <Flex key={batch.id} gap={5} w={450} p={5} justifyContent={'space-around'} borderRadius="7px 7px 7px 0" backgroundColor="green.200">
              <Text fontWeight={'medium'}>
                {batch.batchNumber} - {batch.expiryDate} -{' '}
                {batch.grainType.name}
              </Text>
              <Button size='xs' backgroundColor="green.500" color={'white'} onClick={() => handleBatchClick(batch)}>Add production</Button>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  );
}
export default Batches;
