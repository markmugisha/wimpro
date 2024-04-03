import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Select as ReactSelect } from 'chakra-react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useController, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery } from 'react-query';

import countries from '../../../constants/countries';

import { errorToast, successToast } from '../../../toasts';
import {
  getGrainTypes,
  getSuppliers,
  receiveProducts,
} from '../../../api/client';

const countrySelectOptions = countries.map((country) => ({
  label: country,
  value: country,
}));

const createReceivedProduceSchema = z.object({
  supplierId: z.coerce.number().positive('Supplier is required'),
  // productSupplyType: z
  //   .string()
  //   .trim()
  //   .nonempty('Please enter the product supply type.'),
  cityOrDistrict: z.string().trim().nonempty('Please enter the City or Town.'),
  country: z
    .string({ required_error: 'Please specify country.' })
    .trim()
    .nonempty('Please specify country.')
    .refine((val) => countries.includes(val), 'Invalid country'),
  grainTypeId: z.coerce.number().positive('Please enter the grain type.'),
  driverId: z
    .string()
    .trim()
    .nonempty('Please enter the driver identification.'),
  vehicleNumber: z
    .string()
    .trim()
    .nonempty('Please enter the vehicle registration number.'),
});

const ReceivingProduceForm = () => {
  const {
    register,
    reset,
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createReceivedProduceSchema) });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ control, name: 'country' });

  const toast = useToast();

  const receivedProduceMutation = useMutation((data) => receiveProducts(data), {
    onSuccess() {
      toast(successToast('Product Received!', 'Product has been received'));
      reset();
    },
    onError() {
      toast(errorToast('Ooops!!', 'Something went wrong'));
    },
  });

  const suppliers = useQuery(['suppliers'], () => getSuppliers());
  const grainTypes = useQuery(['grain-types'], () => getGrainTypes());

  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '35px',
    borderRadius: '2px 10px 0 10px',
    boxShadow: '2px 2px 2px 1px lightgray',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
    '::placeholder': { color: 'gray.300' },
  };

  const inputLabelStyles = {
    fontSize: '0.9rem',
    marginBottom: '0',
  };

  const handleSubmit = async (data) => {
    receivedProduceMutation.mutate(data);
  };

  return (
    <Container py={0} maxW="5xl" centerContent width={'100%'}>
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
      >
        <Heading size="md">Receive Produce</Heading>
        <form onSubmit={hookFormSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignContent="center"
            width="100%"
            spacing="4rem"
          >
            <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.supplierId}>
                <FormLabel sx={inputLabelStyles}>Supplier</FormLabel>
                <Select
                  {...register('supplierId')}
                  sx={inputFieldStyles}
                  defaultValue=""
                >
                  <option value="">-- Select Supplier --</option>
                  {suppliers.data?.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.supplierId?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              {/* <FormControl isInvalid={errors.productSupplyType}>
                <FormLabel sx={inputLabelStyles}>Product Supply Type</FormLabel>
                <Select
                  placeholder="Choose product supply type"
                  {...register('productSupplyType')}
                  sx={inputFieldStyles}
                >
                  <option value="purchase">Purchase</option>
                  <option value="service">Service</option>
                  <option value="storage">Storage</option>
                </Select>
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.productSupplyType?.message}</Text>
                </FormErrorMessage>
              </FormControl> */}

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

              <FormControl isInvalid={errors.cityOrDistrict}>
                <FormLabel sx={inputLabelStyles}>City/District</FormLabel>
                <Input sx={inputFieldStyles} {...register('cityOrDistrict')} />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.cityOrDistrict?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.country}>
                <FormLabel sx={inputLabelStyles}>Country</FormLabel>
                <ReactSelect
                  chakraStyles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: '0.8rem',
                      h: '30px',
                      borderRadius: '2px 10px 0 10px',
                      boxShadow: '2px 2px 2px 1px lightgray',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }),
                  }}
                  options={countrySelectOptions}
                  value={
                    countryValue
                      ? countrySelectOptions.find(
                          (x) => x.value === countryValue
                        )
                      : countryValue
                  }
                  onChange={(option) =>
                    countryOnChange(option ? option.value : option)
                  }
                  {...restCountryField}
                />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.country?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.driverId}>
                <FormLabel sx={inputLabelStyles}>
                  Driver Identification
                </FormLabel>
                <Input
                  placeholder="Enter drivers' identification"
                  {...register('driverId')}
                  sx={inputFieldStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.driverId?.message}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.vehicleNumber}>
                <FormLabel sx={inputLabelStyles}>Vehicle Number</FormLabel>
                <Input
                  placeholder="Enter vehicle registration number"
                  {...register('vehicleNumber')}
                  sx={inputFieldStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.vehicleNumber?.message}</Text>
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>

          <Flex justifyContent="center">
            <Button
              isDisabled={receivedProduceMutation.isLoading}
              type="submit"
              flex={1}
              maxW="sm"
              borderRadius="2px 10px 0 10PX"
              boxShadow="5px 5px 5px 1px lightgrey"
              backgroundColor="green.500"
              color="white"
              fontWeight="light"
            >
              {receivedProduceMutation.isLoading ? (
                <>
                  {'Receiving your produce'}{' '}
                  <Spinner color="orange" emptyColor="lightgreen" />
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </Flex>
        </form>
      </Stack>
    </Container>
  );
};

export default ReceivingProduceForm;
