import { Container, Flex, Stack, Text, VStack, Heading } from '@chakra-ui/layout';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';
import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from 'react-query';
import { Spinner } from '@chakra-ui/react';
import { addSecondMass } from '../../../api/client';
import { useEffect } from 'react';

const secondMassFormSchema = z.object({
  secondMass: z.coerce
    .number({ invalid_type_error: 'Please input a number' })
    .positive('Second Mass is required'),
  lotId: z.string().trim(),
  deductions: z.coerce
    .number()
    .nonnegative('Enter Second Mass for this to be calculated'),
  grossWeight: z.coerce
    .number()
    .positive('Enter Second Mass for this to be calculated'),
  netWeight: z.coerce
    .number()
    .positive('Enter Second Mass for this to be calculated'),
});

const deductibles = [
  'moistureContent',
  'ppb',
  'ppm',
  'ddn',
  'coloration',
  'insectOrvermin',
  'brokenGrain',
  'immatureShrivelled',
  'rottenOrDiseased',
  'organicMatter',
  'inorganicMatter',
  'filth',
  'contrastingVarieties',
  'heatDamaged',
];

const SecondMassForm = ({ row, onSubmit }) => {
  const queryClient = useQueryClient();
  const {
    handleSubmit: hookFormSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(secondMassFormSchema) });

  const secondMass = watch('secondMass');

  const setCalculations = ({ grossWeight, deductions, netWeight }) => {
    setValue('grossWeight', grossWeight);
    setValue('deductions', deductions);
    setValue('netWeight', netWeight);
  };

  const calculate = () => {
    if (
      typeof secondMass !== 'number' ||
      secondMass === 0 ||
      Number.isNaN(secondMass)
    ) {
      setCalculations({ deductions: '', grossWeight: '', netWeight: '' });
      return;
    }
    const grossWeight = (row.commodityReceipt.firstMass - secondMass).toFixed(
      2
    );

    const deductions = deductibles
      .reduce((total, key) => {
        const d = row.qaDatum[key];
        return !d ? total : total + (d / 100) * grossWeight;
      }, 0)
      .toFixed(2);

    const netWeight = (grossWeight - deductions).toFixed(2);
    setCalculations({ deductions, grossWeight, netWeight });
  };

  useEffect(() => {
    calculate();
  }, [secondMass]);

  const secondMassMutation = useMutation((data) => addSecondMass(data), {
    onSuccess() {
      queryClient.invalidateQueries(['pending-second-mass']);
      onSubmit();
    },
  });

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

  const handleSubmit = (data) => {
    secondMassMutation.mutate(data);
  };

  return (
    <Container
      py={10}
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
      <Heading size="md">Second Mass</Heading>
      <form onSubmit={hookFormSubmit(handleSubmit)}>
        <Stack
          p={{ base: 2, sm: 4, lg: 4 }}
          margin="auto"
          direction={{ base: 'column', md: 'row' }}
          justifyContent="center"
          alignContent="center"
          width="100%"
          spacing={8}
        >
          <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
            <FormControl isInvalid={errors.lotId}>
              <FormLabel sx={inputLabelStyles}>Lot ID</FormLabel>
              <Input
                placeholder="23DSCFA5"
                {...register('lotId')}
                sx={inputFieldStyles}
                value={row?.lotId}
                readOnly
              />
              <FormErrorMessage>{errors.lotId?.message}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel sx={inputLabelStyles}>Grain Type</FormLabel>
              <Input
                sx={inputFieldStyles}
                value={row?.grainType.name}
                readOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={inputLabelStyles}>First Mass</FormLabel>
              <Input
                sx={inputFieldStyles}
                value={row?.commodityReceipt.firstMass}
                readOnly
              />
            </FormControl>

            <FormControl isInvalid={errors.secondMass}>
              <FormLabel sx={inputLabelStyles}>Second Mass (Kgs)</FormLabel>
              <Input
                placeholder="eg 1200"
                {...register('secondMass', { valueAsNumber: true })}
                sx={inputFieldStyles}
              />
              <FormErrorMessage>
                <Text>{errors.secondMass?.message}</Text>
              </FormErrorMessage>
            </FormControl>
          </VStack>
          <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
            <FormControl isInvalid={errors.grossWeight}>
              <FormLabel sx={inputLabelStyles}>Gross Weight</FormLabel>
              <Input
                {...register('grossWeight')}
                sx={inputFieldStyles}
                readOnly
              />
              <FormErrorMessage>
                <Text>{errors.grossWeight?.message}</Text>
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.deductions}>
              <FormLabel sx={inputLabelStyles}>Deductions</FormLabel>
              <Input
                {...register('deductions')}
                sx={inputFieldStyles}
                readOnly
              />
              <FormErrorMessage>
                <Text>{errors.deductions?.message}</Text>
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.netWeight}>
              <FormLabel sx={inputLabelStyles}>Net Weight</FormLabel>
              <Input
                {...register('netWeight')}
                sx={inputFieldStyles}
                readOnly
              />
              <FormErrorMessage>
                <Text>{errors.netWeight?.message}</Text>
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
            isDisabled={secondMassMutation.isLoading}
          >
            {secondMassMutation.isLoading ? <Spinner /> : 'Submit'}
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
export default SecondMassForm;
