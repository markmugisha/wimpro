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
  Textarea,
  //   Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import * as z from 'zod';
import { errorToast, successToast } from '../../../toasts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { createFumigation } from '../../../api/client';
// import { Select } from 'chakra-react-select';

const fumigationSchema = z.object({
  batchItemId: z.coerce.number(),
  dosage: z.coerce.number().positive('Dosage used is required'),
  stackNumber: z.string().trim().nonempty('Stack number is required'),
  startDate: z.coerce.date({
    invalid_type_error: 'Fumigation date is required',
    required_error: 'Fumigation date is required',
  }),
  endDate: z.coerce.date({
    invalid_type_error: 'Fumigation date is required',
    required_error: 'Fumigation date is required',
  }),
  remarks: z.string().trim().max(300, 'Too long'),
});

const FumigateForm = ({ stack }) => {
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: zodResolver(fumigationSchema) });

  const toast = useToast();

  const fumigationMutation = useMutation((data) => createFumigation(data), {
    onSuccess() {
      toast(
        successToast(
          'Fumigation Date Set!',
          'This stack number has been scheduled for fumigation.'
        )
      );
      reset();
    },
    onError(error) {
      if (error.errorCode === 'duplicate-sart-date-for-stack-number') {
        toast(
          errorToast(
            'Duplicate fumigation start date',
            'This stack number has already been scheduled for this start date'
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
  });

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
    fumigationMutation.mutate(data);
    console.log(data);
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
            <chakra.span fontWeight="normal">Fumigate Stack</chakra.span>
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
                {...register('batchItemId')}
                sx={inputFieldStyles}
                _readOnly={inputFieldStyles}
                readOnly
                value={stack.id}
              />
              <FormControl isInvalid={errors.stackNumber}>
                <FormLabel sx={inputLabelStyles}>Stack Number</FormLabel>
                <Input
                  sx={inputFieldStyles}
                  value={stack.stackNumber}
                  {...register('stackNumber')}
                  readOnly
                />
                <FormErrorMessage>
                  {errors.stackNumber?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.startDate}>
                <FormLabel sx={inputLabelStyles}>Start Date</FormLabel>
                <Input
                  type="date"
                  sx={inputFieldStyles}
                  {...register('startDate')}
                />
                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.endDate}>
                <FormLabel sx={inputLabelStyles}>End Date</FormLabel>
                <Input
                  type="date"
                  sx={inputFieldStyles}
                  {...register('endDate')}
                />
                <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.dosage}>
                <FormLabel sx={inputLabelStyles}>Dosage</FormLabel>
                <Input sx={inputFieldStyles} {...register('dosage')} />
                <FormErrorMessage>{errors.dosage?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.remarks}>
                <FormLabel sx={inputLabelStyles}>
                  Remarks ({watch('remarks')?.length ?? 0}/300)
                </FormLabel>
                <Textarea
                  sx={inputFieldStyles}
                  {...register('remarks')}
                  defaultValue=""
                />
                <FormErrorMessage>{errors.remarks?.message}</FormErrorMessage>
              </FormControl>

              <Flex justifyContent="center" alignContent="center">
                <Button
                  isDisabled={fumigationMutation.isLoading}
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
                  {fumigationMutation.isLoading ? (
                    <>
                      {'Submitting fumigation data'}{' '}
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
export default FumigateForm;
