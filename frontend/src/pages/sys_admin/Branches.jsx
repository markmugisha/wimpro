import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { Select as ReactSelect } from 'chakra-react-select';
import { useForm, useController } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';
// import axios from 'axios';
import { useMutation } from 'react-query';

import countries from '../../constants/countries';
import { createWarehouse } from '../../api/client';
import { errorToast, successToast } from '../../toasts';

const countrySelectOptions = countries.map((country) => ({
  label: country,
  value: country,
}));

const createWarehouseSchema = z
  .object({
    name: z.string().trim().nonempty('Organization must have a name.'),
    address: z
      .string()
      .trim()
      .nonempty("Please enter the organization's address."),
    cityOrTown: z.string().trim().nonempty('Please enter the City or Town.'),
    country: z
      .string({ required_error: 'Please specify country.' })
      .trim()
      .nonempty('Please specify country.')
      .refine((val) => countries.includes(val), 'Invalid country'),
    email: z
      .string()
      .trim()
      .nonempty('Email is required')
      .email('Invalid email'),
    countryPhoneCode: z
      .string()
      .trim()
      .nonempty('Company phone code is required'),
    phoneNumber: z
      .string()
      .trim()
      .nonempty('Phone number is required')
      .min(8, 'Phone number is too short'),
    storageCapacity: z.coerce.number(), //check correctness of this
  })
  .refine(
    ({ phoneNumber, countryPhoneCode }) => {
      try {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber, {
          defaultCallingCode: countryPhoneCode,
        });

        return parsedPhoneNumber.isValid();
      } catch (e) {
        return false;
      }
    },
    { message: 'Invalid phone number', path: ['phoneNumber'] }
  )
  .transform((data) => {
    const normalizedPhoneNumber = parsePhoneNumber(data.phoneNumber, {
      defaultCallingCode: data.countryPhoneCode,
    }).formatInternational();

    delete data.countryPhoneCode;

    return {
      ...data,
      phoneNumber: normalizedPhoneNumber,
    };
  });

function Branches() {
  const {
    register,
    reset,
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createWarehouseSchema) });

  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ control, name: 'country' });

  const toast = useToast();

  const warehouseMutation = useMutation((data) => createWarehouse(data), {
    onSuccess() {
      toast(
        successToast(
          'New Branch',
          'Congratulations! New warehouse branch successfully created.'
        )
      );
      reset();
    },
    onError(error) {
      if (error.errorCode === 'branch-already-exists') {
        toast(
          errorToast('Duplicate Branch Name', 'This Branch Name already exists')
        );
      } else {
        toast(errorToast('Ooops!!', 'Something went wrong'));
      }
    },
  });

  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '40px',
    borderRadius: '2px 10px 0 10px',
    boxShadow: '5px 5px 5px 1px lightgray',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
  };

  const inputLabelStyles = {
    fontSize: '0.9rem',
    marginBottom: '0',
  };

  const handleSubmit = async (data) => {
    warehouseMutation.mutate(data);
  };

  return (
    <Container py={0} maxW="4xl" centerContent width={'100%'}>
      <VStack spacing={5} mb={10} mt={10}>
        <Text fontSize={"2xl"} >Welcome! Create your warehouse branch.</Text>
      </VStack>
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
      <Heading size="md">Warehouse Branch</Heading>
      <form onSubmit={hookFormSubmit(handleSubmit)} style={{ width: '100%' }}>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignContent="center"
            width="100%"
            spacing={5}
          >
            <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.name}>
                <FormLabel sx={inputLabelStyles}>Name</FormLabel>
                <Input sx={inputFieldStyles} {...register('name')} />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.name?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.address}>
                <FormLabel sx={inputLabelStyles}>Address</FormLabel>
                <Input sx={inputFieldStyles} {...register('address')} />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.address?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.cityOrTown}>
                <FormLabel sx={inputLabelStyles}>City/Town</FormLabel>
                <Input sx={inputFieldStyles} {...register('cityOrTown')} />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.cityOrTown?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.country}>
                <FormLabel sx={inputLabelStyles}>Country</FormLabel>
                <ReactSelect
                  chakraStyles={{
                    // dropdownIndicator: (baseStyles) => ({
                    //   ...baseStyles,
                    //   fontSize: '0.8rem',
                    //   h: '30px',
                    //   borderRadius: '2px 10px 0 10px',
                    //   boxShadow: '5px 5px 5px 1px lightgray',
                    //   alignItems: 'center',
                    //   marginLeft: 'auto',
                    //   marginRight: 'auto',
                    // }),
                    control: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: '0.8rem',
                      h: '30px',
                      borderRadius: '2px 10px 0 10px',
                      boxShadow: '5px 5px 5px 1px lightgray',
                      alignItems: 'center',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                      _invalid: {
                        border: '1px',
                        borderColor: 'red.500',
                        boxShadow: '0 0 0 0',
                      },
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
            </VStack>
            <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.email}>
                <FormLabel sx={inputLabelStyles}>Company Email</FormLabel>
                <Input
                  type="email"
                  sx={inputFieldStyles}
                  {...register('email')}
                />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.email?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.countryPhoneCode || errors.phoneNumber}
              >
                <FormLabel sx={inputLabelStyles}>Phone Number</FormLabel>
                <InputGroup sx={inputFieldStyles}>
                  <InputLeftAddon h="30" p={0} backgroundColor="">
                    <Select
                      sx={inputFieldStyles}
                      h="30px"
                      borderRight="0px"
                      size="sm"
                      _invalid={{ border: 0 }}
                      {...register('countryPhoneCode')}
                    >
                      <option value="256">+256</option>
                      <option value="257">+257</option>
                      <option value="258">+258</option>
                    </Select>
                  </InputLeftAddon>
                  <Input
                    sx={inputFieldStyles}
                    h="30px"
                    fontSize="0.8rem"
                    borderRadius="2px 10px 0 10px"
                    type="tel"
                    borderLeft={0}
                    {...register('phoneNumber')}
                  />
                </InputGroup>
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.countryPhoneCode?.message}</Text>
                </FormErrorMessage>
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.phoneNumber?.message}</Text>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password}>
                <FormLabel sx={inputLabelStyles}>
                  Storage capacity(Kg)
                </FormLabel>
                <Input
                  sx={inputFieldStyles}
                  type="float"
                  {...register('storageCapacity')}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>{errors.password?.message}</Text>
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>
          <Flex justifyContent="center" alignContent="center">
            <Button
              isDisabled={warehouseMutation.isLoading}
              type="submit"
              flex={1}
              maxW="sm"
              borderRadius="2px 10px 0 10PX"
              boxShadow="5px 5px 5px 1px lightgrey"
              backgroundColor="green.500"
              color="white"
              fontWeight="light"
            >
              {warehouseMutation.isLoading ? (
                <>
                  {'Setting up your warehouse'}{' '}
                  <Spinner color="orange" emptyColor="lightgreen" />
                </>
              ) : (
                'Create Warehouse'
              )}
            </Button>
          </Flex>
          </form>
        </Stack>
    </Container>
  );
}

export default Branches;
