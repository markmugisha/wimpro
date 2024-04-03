import {
  Button,
  chakra,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import * as z from 'zod';
import { errorToast, successToast } from '../../../toasts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addReceivedStock } from '../../../api/client';
import { useMemo } from 'react';

const createReceiveStockSchema = z.object({
  dailyProductionId: z.coerce
    .number()
    .positive('Please enter the production ID.'),
  stackNumber: z.string().trim().nonempty('Stack number is required'),
});

const ReceiveStock = ({ stock }) => {
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createReceiveStockSchema) });
  const queryClient = useQueryClient();

  const toast = useToast();

  const receivedStockDataMutation = useMutation(
    (data) => addReceivedStock(data),
    {
      onSuccess() {
        queryClient.invalidateQueries(['stock']);
        queryClient.invalidateQueries(['order-picking-plan']);
        toast(successToast('Stock Received!', 'Stock has been received.'));
        reset();
      },
      onError() {
        toast(errorToast('Ooops!', 'Something went wrong.'));
      },
    }
  );

  const stackNumber = useMemo(() => {
    return stock.batch.batchItems.find(
      (batchItem) => stock.weightPerBag === batchItem.weightPerBag
    )?.stackNumber;
  }, [stock]);

  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '30px',
    borderRadius: '2px 10px 0 10px',
    boxShadow: '5px 5px 5px 1px lightgray',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    outline: 'none',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
  };

  const inputLabelStyles = {
    fontSize: '0.9rem',
    marginBottom: '0',
    fontWeight: 'light',
  };

  const handleSubmit = async (data) => {
    receivedStockDataMutation.mutate(data);
  };

  return (
    <Container py={0} maxW="lg" centerContent width={'100%'} pt={12}>
      <form onSubmit={hookFormSubmit(handleSubmit)} style={{ width: '100%' }}>
        <Stack
          spacing={5}
          borderRadius="0 20px 0 20px"
          boxShadow="3px 5px 20px 1px slategrey"
          justifyContent="center"
          alignContent="center"
          maxW={{ base: '90%', md: '4xl' }}
          width="100%"
          p={5}
          mb={5}
          bg="white"
        >
          <Heading
            fontWeight="semibold"
            fontSize="2xl"
            textTransform="capitalize"
          >
            <chakra.span fontWeight="normal">Receive Stock</chakra.span>
          </Heading>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignContent="center"
            width="100%"
            spacing={7}
          >
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
              <Input
                type="hidden"
                sx={inputFieldStyles}
                value={stock.id}
                readOnly
                {...register('dailyProductionId')}
              />

              <FormControl isInvalid={errors.batchNumber}>
                <FormLabel sx={inputLabelStyles}>Batch Number</FormLabel>
                <Input
                  sx={inputFieldStyles}
                  value={stock.batchNumber}
                  readOnly
                />
                <FormErrorMessage>
                  {errors.batchNumber?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.stackNumber}>
                <FormLabel sx={inputLabelStyles}>Stack Number</FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('stackNumber')}
                  value={stackNumber}
                  readOnly={!!stackNumber}
                />
                <FormErrorMessage>
                  {errors.stackNumber?.message}
                </FormErrorMessage>
              </FormControl>

              <Flex justifyContent="center" alignContent="center">
                <Button
                  isDisabled={receivedStockDataMutation.isLoading}
                  type="submit"
                  flex={1}
                  maxW="sm"
                  borderRadius="2px 10px 0 10PX"
                  boxShadow="5px 5px 5px 1px lightgrey"
                  color="white"
                  backgroundColor="green.500"
                  fontWeight="light"
                  _hover={{ backgroundColor: 'green.600' }}
                >
                  {receivedStockDataMutation.isLoading ? (
                    <>
                      {'Submitting Received Stock data'}{' '}
                      <Spinner color="orange" emptyColor="lightgreen" />
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Flex>
            </VStack>
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};

export default ReceiveStock;
