import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { errorToast, successToast } from '../../../toasts';
import { createGrainType } from '../../../api/client';
import { useMutation, useQueryClient } from 'react-query';

const grainSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty('Grain Type is required')
    .regex(/^[A-Z]/, 'Grain type must start with uppercase letter'),
});

const GrainTypeForm = () => {
  const {
    handleSubmit: hookFormSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(grainSchema) });

  const toast = useToast();
  const queryClient = useQueryClient();

  const grainTypeMutation = useMutation((data) => createGrainType(data), {
    onSuccess() {
      toast(
        successToast(
          'New Grain Type Added',
          'Grain type has been created Successfully'
        )
      );
      reset();
      queryClient.invalidateQueries(['grain-types']);
    },
    onError(error) {
      if (error.errorCode === 'grain-type-already-exists') {
        toast(
          errorToast(
            'Duplicate Grain Type',
            'This grain type is already created'
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
    grainTypeMutation.mutate(data);
    // console.log(data);
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
      width="80%"
      p={5}
      mb={5}
    >
      <Stack padding={5} width="60%" margin="auto">
        <form onSubmit={hookFormSubmit(handleSubmit)}>
          <VStack spacing={3} mb={8}>
            <FormControl isInvalid={errors.name}>
              <FormLabel sx={inputLabelStyles}>Grain Type</FormLabel>
              <Input
                placeholder="Add grain type"
                {...register('name')}
                sx={inputFieldStyles}
              />
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.name?.message}</Text>
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
        </form>
      </Stack>
    </Container>
  );
};
export default GrainTypeForm;
