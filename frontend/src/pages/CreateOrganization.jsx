import {
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridItem,
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
import { useMutation } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import countries from '../constants/countries';
import { createOrganization } from '../api/client';
import { errorToast } from '../toasts';
import Navbar_bare from '../components/Navbar_bare';
import LogIn from './LogIn';

const countrySelectOptions = countries.map((country) => ({
  label: country,
  value: country,
}));

const organizationAdminSchema = z
  .object({
    // accountId: z
    //   .string()
    //   .trim()
    //   .nonempty('Organization ID is required')
    //   .regex(/^[a-z]/, 'ID must start with lowercase letter')
    //   .min(3, 'Minimum of 3 characters allowed')
    //   .max(15, 'Maximum of 15 characters allowed')
    //   .regex(
    //     /^[a-z0-9_]+$/,
    //     'ID can only contain lowercase characters, digits and underscore'
    //   ),
    name: z.string().trim().nonempty('Organization name is required'),
    address: z.string().trim().nonempty('Organization address is required'),
    cityOrTown: z.string().trim().nonempty('City/Town is required'),
    country: z
      .string({ required_error: 'Country is required' })
      .trim()
      .nonempty('Country is required')
      .refine((val) => countries.includes(val), 'Invalid country'),
    firstName: z.string().trim().nonempty('First name is required'),
    lastName: z.string().trim().nonempty('Last name is required'),
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
      .min(2, 'Phone number is too short'),
    password: z.string().nonempty('Password required'),
    confirmPassword: z.string().nonempty('Confirm admin password'),
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
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Must be the same as password',
    path: ['confirmPassword'],
  })
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

function CreateOrganization() {
  const {
    register,
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(organizationAdminSchema) });
  const {
    field: {
      value: countryValue,
      onChange: countryOnChange,
      ...restCountryField
    },
  } = useController({ control, name: 'country' });

  const navigate = useNavigate();
  const toast = useToast();

  const createOrganizationMutation = useMutation(
    (data) => createOrganization(data),
    {
      onSuccess() {
        navigate('/login?new-account');
      },
      onError(error) {
        if (error.errorCode === 'email-already-exists') {
          toast(errorToast('Duplicate Email', 'This Email is already in use'));
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

  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '40px',
    borderRadius: '2px 10px 0 10px',
    boxShadow: '5px 5px 5px 1px lightgray',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
    '::placeholder': { color: 'gray.300' },
  };

  const inputLabelStyles = {
    fontSize: '0.8rem',
    marginBottom: '0',
  };

  const formatFormData = (formData) => {
    const organization = {
      // accountId: formData.accountId,
      name: formData.name,
      address: formData.address,
      cityOrTown: formData.cityOrTown,
      country: formData.country,
    };

    const admin = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    return { admin, organization };
  };

  const handleSubmit = async (data) => {
    createOrganizationMutation.mutate(formatFormData(data));
  };

  return (
    <>
      <GridItem
        borderBottom="1px solid lightgrey"
        boxShadow="2px 1px 1px 1px lightgrey"
      >
        <Navbar_bare />
      </GridItem>
      <Container py={2} maxW="full" h="4xl"
        bgGradient={{md: 'linear(to-br, white 0%, white 50%, green.200 50%, green.200 100%)'}}
      >
        <VStack spacing={0} mt={25} mb={25}>
          {/* <Text fontSize="0.8rem">Welcome to WIMPro!</Text> */}
          <Heading fontSize="2xl">Create your organization account</Heading>
          <Text fontSize={'sm'} mt="3" color="blue.500">
            <Link
              as={LogIn}
              to="/login"
              fontSize="0.7rem"
              mt="3"
              color="blue.500"
            >
              Already have an account? Login here!
            </Link>
          </Text>
        </VStack>
        <Center>
          <form
            onSubmit={hookFormSubmit(handleSubmit)}
            style={{ width: '80%' }}
          >
            <Center>
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
                background="white"
              >
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  justifyContent="center"
                  alignContent="center"
                  width="100%"
                  spacing={20}
                >
                  {/* <SimpleGrid columns={2} gap={10} mb={5}> */}
                  <VStack
                    width={{ base: '100%', md: '300px' }}
                    spacing={3}
                    mb={6}
                  >
                    <Heading
                      fontSize="1rem"
                      mr="auto"
                      color="gray.300"
                      width="full"
                      textAlign="center"
                    >
                      Organization Details
                    </Heading>
                    {/* <FormControl isInvalid={errors.accountId}>
                      <FormLabel sx={inputLabelStyles}>
                        Organization ID
                      </FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter organization ID"
                        {...register('accountId')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.accountId?.message}</Text>
                      </FormErrorMessage>
                    </FormControl> */}
                    <FormControl isInvalid={errors.name}>
                      <FormLabel sx={inputLabelStyles}>Name</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter organization name"
                        {...register('name')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.name?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.address}>
                      <FormLabel sx={inputLabelStyles}>Address</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter relevant address details"
                        {...register('address')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.address?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.cityOrTown}>
                      <FormLabel sx={inputLabelStyles}>City/Town</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter city where main offices are located"
                        {...register('cityOrTown')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.cityOrTown?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={errors.country}>
                      <FormLabel sx={inputLabelStyles}>Country</FormLabel>
                      <ReactSelect
                        chakraStyles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            fontSize: '0.8rem',
                            h: '10px',
                            borderRadius: '2px 10px 0 10px',
                            boxShadow: '5px 5px 5px 1px lightgray',
                            alignItems: 'center',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            _invalid: { border: '1px', borderColor: 'red.500' },
                          }),
                        }}
                        placeholder="Select country"
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
                        <Text>{errors.country?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                  <VStack
                    width={{ base: '100%', md: '300px' }}
                    spacing={3}
                    mb={6}
                  >
                    <Heading
                      fontSize="1rem"
                      mr="auto"
                      color="gray.300"
                      width="full"
                      textAlign="center"
                    >
                      Admin Account Details
                    </Heading>
                    <FormControl isInvalid={errors.firstName}>
                      <FormLabel sx={inputLabelStyles}>First Name</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter first name"
                        {...register('firstName')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.firstName?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.lastName}>
                      <FormLabel sx={inputLabelStyles}>Last Name</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        placeholder="Enter last name"
                        {...register('lastName')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.lastName?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.email}>
                      <FormLabel sx={inputLabelStyles}>Company Email</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        type="email"
                        placeholder="Enter company email"
                        {...register('email')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.email?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.countryPhoneCode || errors.phoneNumber}
                    >
                      <FormLabel sx={inputLabelStyles}>Phone Number</FormLabel>
                      <InputGroup>
                        <InputLeftAddon sx={inputFieldStyles} p={0}>
                          <Select
                            size="sm"
                            border={0}
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
                          type="tel"
                          placeholder="Enter phone number"
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
                      <FormLabel sx={inputLabelStyles}>Password</FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        type="password"
                        placeholder="Enter password"
                        {...register('password')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.password?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.confirmPassword}>
                      <FormLabel sx={inputLabelStyles}>
                        Confirm password
                      </FormLabel>
                      <Input
                        sx={inputFieldStyles}
                        type="password"
                        placeholder="Confirm password"
                        {...register('confirmPassword')}
                      />
                      <FormErrorMessage fontSize="0.7rem">
                        <Text>{errors.confirmPassword?.message}</Text>
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                  {/* </SimpleGrid> */}
                </Stack>
                <Flex justifyContent="center">
                  <Button
                    isDisabled={createOrganizationMutation.isLoading}
                    type="submit"
                    flex={1}
                    maxW="sm"
                    borderRadius="2px 10px 0 10PX"
                    boxShadow="5px 5px 5px 1px lightgrey"
                    backgroundColor="green.500"
                    color="white"
                    fontWeight="light"
                    _hover={{ backgroundColor: 'green.600' }}
                  >
                    {createOrganizationMutation.isLoading ? (
                      <>
                        {'Creating your Account'}{' '}
                        <Spinner color="orange" emptyColor="lightgreen" />
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </Flex>
              </Stack>
            </Center>
          </form>
        </Center>
      </Container>
    </>
  );
}

export default CreateOrganization;
