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
  Spinner,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { logIn } from '../api/client';
import { errorToast, successToast } from '../toasts';
import useAuth from '../auth/useAuth';
import Navbar_bare from '../components/Navbar_bare';
import CreateOrganization from './CreateOrganization';

const loginSchema = z.object({
  email: z.string().trim().nonempty('Email is required').email('Invalid email'),
  password: z.string().nonempty('Password required'),
});

function LogIn() {
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    if (searchParams.has('new-account')) {
      toast(successToast('Success', 'Organization account created!'));
    }
  }, [searchParams, toast]);

  const loginMutation = useMutation((data) => logIn(data), {
    onSuccess(user) {
      setCurrentUser(user);
      if (searchParams.has('returnTo')) {
        navigate(searchParams.get('returnTo'), { replace: true });
      } else {
        navigate('/dashboard');
      }
    },
    onError(error) {
      if (error.errorCode === 'auth/invalid-credentials') {
        toast(errorToast('Error', 'Invalid username or password'));
      } else {
        toast(errorToast('Oops!', 'Something went wrong'));
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

  const handleSubmit = (data) => {
    loginMutation.mutate(data);
  };

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <GridItem
        borderBottom="1px solid lightgrey"
        boxShadow="2px 1px 1px 1px lightgrey"
      >
        <Navbar_bare />
      </GridItem>
      <Container pt={5} maxW="xl">
        <VStack spacing={2} mb={10}>
          <Text fontSize="0.8rem">Welcome to WIMPro!</Text>
          <Heading fontSize="1.2rem">Log in to your account</Heading>
        </VStack>
        <Center>
          <form
            onSubmit={hookFormSubmit(handleSubmit)}
            style={{ width: '100%' }}
          >
            <Center>
              <Stack
                spacing={6}
                mb={6}
                borderRadius="0 20px 0 20px"
                boxShadow="3px 5px 20px 1px slategrey"
                maxW={{ base: '90%', md: '4xl' }}
                width="100%"
                pt="30px"
                pb="50px"
                pr="90px"
                pl="90px"
              >
                <FormControl isInvalid={errors.email}>
                  <FormLabel sx={inputLabelStyles}>Email</FormLabel>
                  <Input
                    sx={inputFieldStyles}
                    type="email"
                    placeholder="Enter email"
                    {...register('email')}
                  />
                  <FormErrorMessage fontSize="0.7rem">
                    <Text>{errors.email?.message}</Text>
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
                  <Text fontSize="0.7rem" mt="3" color="blue.500">
                    Forgot password &nbsp;&nbsp;&nbsp;&nbsp;
                    <Link as={CreateOrganization} to="/create-organization">
                      Create Organization
                    </Link>
                  </Text>
                </FormControl>
                <Flex justifyContent="center" alignContent="center">
                  <Button
                    flex={1}
                    maxW="250px"
                    borderRadius="2px 10px 0 10PX"
                    boxShadow="5px 5px 5px 1px lightgrey"
                    backgroundColor="green.500"
                    color="white"
                    fontWeight="light"
                    type="submit"
                    marginTop="30px"
                    _hover={{ backgroundColor: 'green.600' }}
                    isDisabled={loginMutation.isLoading}
                  >
                    {loginMutation.isLoading ? (
                      <>
                        {'Logging in '}{' '}
                        <Spinner color="orange" emptyColor="lightgreen" />
                      </>
                    ) : (
                      'Log in'
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

export default LogIn;
