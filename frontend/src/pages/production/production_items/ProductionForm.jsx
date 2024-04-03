import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation } from 'react-query';
import { addDailyProduction } from '../../../api/client';
import { useEffect } from 'react';
import { errorToast, successToast } from '../../../toasts';

const zNull = z
  .string()
  .trim()
  .length(0, 'Number required')
  .transform(() => null);
const zPercent = z.coerce.number().min(0).max(100).optional();

const numberOfBagsSchema = z.coerce
  .number()
  .positive('Number of bags must be a positive whole number')
  .int('Number of bags must be a positive whole number')
  .or(zNull);
const weightPerBagSchema = z.coerce
  .number()
  .positive('Number of bags must be a positive whole number')
  .int('Number of bags must be a positive whole number')
  .or(zNull);

const productionSchema = z.object({
  grainTypeId: z.coerce.number().positive('Please enter the grain type.'),
  totalWeight: z.coerce.number().positive('Enter the production total weight'),
  numberOfBags: numberOfBagsSchema,
  weightPerBag: weightPerBagSchema,
  averageMoistureContent: zPercent,
  batchNumber: z.string().trim().nonempty('Batch number is required'),
});

const ProductionForm = ({ disclosure, batch: { grainType, batchNumber } }) => {
  const {
    handleSubmit: hookFormSubmit,
    register,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productionSchema) });

  const toast = useToast();

  const dailyProductionMutation = useMutation(
    (data) => addDailyProduction(data),
    {
      onSuccess() {
        toast(
          successToast(
            'Daily Production 💯🥁',
            "Today's production has been submitted successfully"
          )
        );
        reset();
        disclosure.onClose();
      },
      onError(error) {
        if (error.errorCode === 'no-silo-inventory') {
          toast(
            errorToast(
              'No silo inventory.',
              error.response?.data?.message || error.message
            )
          );
        } else {
          toast(
            errorToast(
              'Something went wrong.',
              error.response?.data?.message || error.message
            )
          );
        }
      },
    }
  );

  const numberOfBags = numberOfBagsSchema.safeParse(watch('numberOfBags'));
  const weightPerBag = weightPerBagSchema.safeParse(watch('weightPerBag'));

  const calculate = () => {
    if (!numberOfBags.data || !weightPerBag.data) {
      setValue('totalWeight', '');
      return;
    }
    setValue('totalWeight', numberOfBags.data * weightPerBag.data);
    clearErrors('totalWeight');
  };

  useEffect(calculate, [numberOfBags.data, weightPerBag.data]);
  useEffect(() => reset(), [disclosure.isOpen]);

  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '35px',
    borderRadius: '2px 10px 0 10px',
    boxShadow: '2px 2px 2px 1px lightgray',
    alignItems: 'center',
    // marginLeft: 'auto',
    // marginRight: 'auto',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
  };

  const inputLabelStyles = {
    fontSize: '0.9rem',
    marginBottom: '0',
  };

  const handleSubmit = async (data) => {
    dailyProductionMutation.mutate(data);
  };
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      size="2xl"
      isCentered={true}
    >
      <ModalOverlay />
      <ModalContent bg="transparent" boxShadow="none">
        <ModalHeader>
          <ModalCloseButton bg="white" />
        </ModalHeader>
        <ModalBody>{renderForm()}</ModalBody>
      </ModalContent>
    </Modal>
  );

  function renderForm() {
    return (
      <Container
        py={3}
        mt={10}
        spacing={5}
        borderRadius="0 20px 0 20px"
        boxShadow="3px 5px 20px 1px slategrey"
        justifyContent="center"
        alignContent="center"
        maxW={{ base: '90%', md: '4xl' }}
        width="100%"
        bg="white"
        mb={5}
      >
        <form onSubmit={hookFormSubmit(handleSubmit)}>
          <Heading size="md">Today&apos;s Production</Heading>

          <Stack
            p={{ base: 2, sm: 4, lg: 4 }}
            margin="auto"
            direction={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignContent="center"
            width="100%"
            spacing={{ md: 8 }}
          >
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={3}>
              <FormControl isInvalid={errors.grainTypeId}>
                <FormLabel sx={inputLabelStyles}>Grain Type</FormLabel>
                <Input
                  sx={inputFieldStyles}
                  _readOnly={inputFieldStyles}
                  readOnly
                  value={grainType.name}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.grainTypeId?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              <Input
                type="hidden"
                {...register('grainTypeId')}
                sx={inputFieldStyles}
                _readOnly={inputFieldStyles}
                readOnly
                value={grainType.id}
              />

              <FormControl isInvalid={errors.batchNumber}>
                <FormLabel sx={inputLabelStyles}>Batch Number</FormLabel>
                <Input
                  {...register('batchNumber')}
                  sx={inputFieldStyles}
                  _readOnly={inputFieldStyles}
                  readOnly
                  value={batchNumber}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.batchNumber?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.numberOfBags}>
                <FormLabel sx={inputLabelStyles}>No of Bags</FormLabel>
                <Input {...register('numberOfBags')} sx={inputFieldStyles} />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.numberOfBags?.message}</Text>
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.weightPerBag}>
                <FormLabel sx={inputLabelStyles}>Weight per bag</FormLabel>
                <Input {...register('weightPerBag')} sx={inputFieldStyles} />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.weightPerBag?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.totalWeight}>
                <FormLabel sx={inputLabelStyles}>Total Weight</FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('totalWeight')}
                  readOnly={numberOfBags.data && weightPerBag.data}
                />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.totalWeight?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.averageMoistureContent}>
                <FormLabel sx={inputLabelStyles}>Avg MC %</FormLabel>
                <Input
                  {...register('averageMoistureContent')}
                  sx={inputFieldStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.averageMoistureContent?.message}</Text>
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>
          <Flex justifyContent="center">
            <Button
              type="submit"
              flex={1}
              maxW="sm"
              borderRadius="2px 10px 0 10PX"
              boxShadow="5px 5px 5px 1px lightgrey"
              color="white"
              colorScheme="green"
              fontWeight="light"
              isDisabled={dailyProductionMutation.isLoading}
            >
              {dailyProductionMutation.isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </Flex>
        </form>
      </Container>
    );
  }
};
export default ProductionForm;
