import { Button } from '@chakra-ui/button';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/form-control';

import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/input';
import {
  Container,
  Flex,
  Stack,
  Text,
  VStack,
  Heading,
} from '@chakra-ui/layout';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { parsePhoneNumber } from 'libphonenumber-js';
import { Select } from '@chakra-ui/select';
import { useToast } from '@chakra-ui/toast';
import { useMutation } from 'react-query';
import { createSupplier } from '../../../api/client';
import { errorToast, successToast } from '../../../toasts';

const supplierSchema = z
  .object({
    name: z.string().trim().nonempty('Supplier name is required'),
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

const SupplierForm = () => {
  const {
    handleSubmit: hookFormSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(supplierSchema) });

  const toast = useToast();
  const supplierMutation = useMutation((data) => createSupplier(data), {
    onSuccess() {
      toast(
        successToast(
          'New Supplier Added',
          'Supplier has been created Successfully'
        )
      );
      reset();
    },
    onError(error) {
      if (error.errorCode === 'email-already-exists') {
        toast(errorToast('Duplicate Email', 'This email is already in use'));
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
    supplierMutation.mutate(data);
    // console.log(data);
  };
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
      width="80%"
      p={5}
      mb={5}
    >
      <Heading size="md">Register New Supplier</Heading>
        <form onSubmit={hookFormSubmit(handleSubmit)}>
        <Stack padding={2} width="60%" margin="auto">
          <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
            <FormControl isInvalid={errors.name}>
              <FormLabel sx={inputLabelStyles}>Name</FormLabel>
              <Input
                placeholder="Supplier name"
                {...register('name')}
                sx={inputFieldStyles}
              />
              <FormErrorMessage>
                <Text>{errors.name?.message}</Text>
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isInvalid={errors.countryPhoneCode || errors.phoneNumber}
            >
              <FormLabel sx={inputLabelStyles}>Phone Number</FormLabel>
              <InputGroup sx={inputFieldStyles}>
                <InputLeftAddon h="30" p={0}>
                  <Select
                    size="sm"
                    h="30px"
                    _invalid={{ border: 0 }}
                    {...register('countryPhoneCode')}
                    sx={inputFieldStyles}
                  >
                    <option value="256">+256</option>
                    <option value="257">+257</option>
                    <option value="258">+258</option>
                  </Select>
                </InputLeftAddon>
                <Input
                  sx={inputFieldStyles}
                  borderLeftRadius={0}
                  type="tel"
                  borderLeft={0}
                  {...register('phoneNumber')}
                />
              </InputGroup>
              <FormErrorMessage>
                <Text>{errors.countryPhoneCode?.message}</Text>
              </FormErrorMessage>
              <FormErrorMessage>
                <Text>{errors.phoneNumber?.message}</Text>
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel sx={inputLabelStyles}>Email</FormLabel>
              <Input
                type="email"
                placeholder="eg supplier@email.com"
                {...register('email')}
                sx={inputFieldStyles}
              />
              <FormErrorMessage>
                <Text>{errors.email?.message}</Text>
              </FormErrorMessage>
            </FormControl>
          </VStack>
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
            >
              Submit
            </Button>
          </Flex>
          </Stack>
        </form>
    </Container>
  );
};

export default SupplierForm;
