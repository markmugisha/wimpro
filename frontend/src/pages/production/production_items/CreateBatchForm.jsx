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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createBatch, getGrainTypes } from '../../../api/client';
import { errorToast, successToast } from '../../../toasts';
import BatchAlert from './BatchAlert';

const productionSchema = z.object({
  batchNumber: z.string().trim().nonempty('Batch number is required'),
  grainTypeId: z.coerce.number().positive('Please enter the grain type.'),
  expiryDate: z.coerce
    .date({
      invalid_type_error: 'Expiry date is required',
      required_error: 'Expiry date is required',
    })
    .min(dayjs().add(1, 'day').toDate(), 'Expiry must be after today'),
});

const CreateBatchForm = ({ disclosure }) => {
  const alertDisclosure = useDisclosure();
  const queryClient = useQueryClient();

  const {
    handleSubmit: hookFormSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(productionSchema) });

  const toast = useToast();

  const batchMutation = useMutation((data) => createBatch(data), {
    onSuccess() {
      queryClient.invalidateQueries(['batches']);
      toast(
        successToast('Batch created', 'Batch has been created successfully')
      );
      reset();
      alertDisclosure.onClose();
    },
    onError(error) {
      if (error.errorCode === 'duplicate-batch-number') {
        toast(
          errorToast(
            'Duplicate batch number',
            'The provided batch number is already in use by your organization'
          )
        );
      } else {
        toast(
          errorToast(
            'Something went wrong',
            error.response?.data?.message || error.message
          )
        );
      }
    },
  });

  const grainTypes = useQuery(['grain-types'], () => getGrainTypes());

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

  const confirmSubmit = async () => {
    alertDisclosure.onOpen();
  };

  const handleSubmit = async (data) => {
    batchMutation.mutate(data);
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} size="xl" isCentered={true}>
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
        <form onSubmit={hookFormSubmit(confirmSubmit)}>
          <Heading size="md">Create Batch</Heading>

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
              <FormControl isInvalid={errors.batchNumber}>
                <FormLabel sx={inputLabelStyles}>Batch Number</FormLabel>
                <Input {...register('batchNumber')} sx={inputFieldStyles} />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.batchNumber?.message}</Text>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.grainTypeId}>
                <FormLabel sx={inputLabelStyles}>Grain Type</FormLabel>
                <Select
                  placeholder="Choose grain type"
                  {...register('grainTypeId')}
                  sx={inputFieldStyles}
                  defaultValue=""
                >
                  <option value="">-- Select Grain Type --</option>
                  {grainTypes.data?.map((grainType) => (
                    <option key={grainType.id} value={grainType.id}>
                      {grainType.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.grainTypeId?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.expiryDate}>
                <FormLabel sx={inputLabelStyles}>Expiry Date</FormLabel>
                <Input
                  type="date"
                  {...register('expiryDate')}
                  sx={inputFieldStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.expiryDate?.message}</Text>
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>
          <Flex justifyContent="center">
            <BatchAlert
              disclosure={alertDisclosure}
              onOK={hookFormSubmit(handleSubmit)}
            />
            <Button
              type="submit"
              flex={1}
              maxW="sm"
              borderRadius="2px 10px 0 10PX"
              boxShadow="5px 5px 5px 1px lightgrey"
              color="white"
              colorScheme="green"
              fontWeight="light"
              isDisabled={batchMutation.isLoading}
            >
              {batchMutation.isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </Flex>
        </form>
      </Container>
    );
  }
};
export default CreateBatchForm;
