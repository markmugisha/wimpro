import {
  
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from 'react-query';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createUser, getBranches } from '../../../api/client';
import { errorToast, successToast } from '../../../toasts';

const newUserSchema = z
  .object({
    branchId: z.string().trim().nonempty('Branch is required!'),
    role: z.string().trim().nonempty('User role is required!'),
    firstName: z.string().trim().nonempty("User's first name is required!."),
    lastName: z.string().trim().nonempty("User's last name is required!"),
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

const NewUser = () => {
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(newUserSchema) });
  const toast = useToast();
  const newUserMutation = useMutation((data) => createUser(data), {
    onSuccess() {
      toast(
        successToast('New User Added', 'User has been created Successfully')
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

  const branches = useQuery(['branches'], () => getBranches());
  const inputFieldStyles = {
    fontSize: '0.8rem',
    h: '30px',
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
  const handleSubmit = (data) => {
    newUserMutation.mutate(data);
  };
  return (
    <Container py={0} maxW="4xl" centerContent width={'100%'}>
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
        >
              <Stack
                direction={{ base: 'column', md: 'row' }}
                justifyContent="center"
                alignContent="center"
                width="100%"
                spacing={5}
              >
                <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
                  <FormControl isInvalid={errors.branchId}>
                    <FormLabel sx={inputLabelStyles}>User Branch</FormLabel>
                    <Select
                      {...register('branchId')}
                      sx={inputFieldStyles}
                      defaultValue=""
                    >
                      <option value="">-- Select Branch --</option>
                      {branches.data?.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage>
                      <Text>{errors.branchId?.message}</Text>
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.firstName}>
                    <FormLabel sx={inputLabelStyles}>First Name</FormLabel>
                    <Input
                      placeholder="Enter first name"
                      {...register('firstName')}
                      sx={inputFieldStyles}
                    />
                    <FormErrorMessage>
                      <Text>{errors.firstName?.message}</Text>
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.lastName}>
                    <FormLabel sx={inputLabelStyles}>Last Name</FormLabel>
                    <Input
                      placeholder="Enter last name"
                      {...register('lastName')}
                      sx={inputFieldStyles}
                    />
                    <FormErrorMessage>
                      <Text>{errors.lastName?.message}</Text>
                    </FormErrorMessage>
                  </FormControl>
                </VStack>
                <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
                  <FormControl isInvalid={errors.role}>
                    <FormLabel sx={inputLabelStyles}>Role</FormLabel>
                    <Select
                      placeholder="Choose user role"
                      {...register('role')}
                      sx={inputFieldStyles}
                    >
                      <option value="receiving">Receiving Officer</option>
                      <option value="weigh_bridge">Weigh Bridge Officer</option>
                      <option value="store_management">Store Manager</option>
                      <option value="production">Production Manager</option>
                      <option value="shipping">Shipping Manager</option>
                      <option value="sales_management">Sales Manager</option>
                      <option value="sales">Sales Officer</option>

                      <option value="quality_assessment">
                        Quality Assessment Officer
                      </option>
                      <option value="picking_packing">
                        Picking/Packing Officer
                      </option>
                    </Select>
                    <FormErrorMessage>
                      <Text>{errors.role?.message}</Text>
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={errors.email}>
                    <FormLabel sx={inputLabelStyles}>Company Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter company email"
                      {...register('email')}
                      sx={inputFieldStyles}
                    />
                    <FormErrorMessage>
                      <Text>{errors.email?.message}</Text>
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
                </VStack>
          </Stack>
            <Flex justifyContent="center" alignContent="center">
                <Button
                  type="submit"
                  flex={1}
                  maxW="sm"
                  borderRadius="2px 10px 0 10PX"
                  boxShadow="5px 5px 5px 1px lightgrey"
                  backgroundColor="green.500"
                  color="white"
                  fontWeight="light"
                >
                    Add User
                  </Button>
                </Flex>
          </Stack>
                      
    </form>
    </Container>
  );
};

export default NewUser;
