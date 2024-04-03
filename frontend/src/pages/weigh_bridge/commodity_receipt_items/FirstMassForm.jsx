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
import { addFirstMass } from '../../../api/client';

const firstMassSchema = z.object({
  firstMass: z.coerce
    .number({ invalid_type_error: 'Please input a number' })
    .positive('First Mass is required'),
  lotId: z.string().trim(),
});

const FirstMassForm = ({ row, onSubmit }) => {
  const queryClient = useQueryClient();
  const {
    handleSubmit: hookFormSubmit,
    register,
    // reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(firstMassSchema) });

  const firstMassMutation = useMutation((data) => addFirstMass(data), {
    onSuccess() {
      queryClient.invalidateQueries(['pending-first-mass']);
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
    firstMassMutation.mutate(data);
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
      bg="white"
      mb={5}
    >
      <Heading size="md">First Mass</Heading>
      <form onSubmit={hookFormSubmit(handleSubmit)}>
      <Stack p={{ base: 4, sm: 12, lg: 16 }} margin="auto">
          <VStack spacing={3} mb={8}>
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
                placeholder="Maize"
                sx={inputFieldStyles}
                value={row?.grainType.name}
                readOnly
              />
            </FormControl>
            <FormControl isInvalid={errors.firstMass}>
              <FormLabel sx={inputLabelStyles}>First Mass (Kgs)</FormLabel>
              <Input
                placeholder="eg 1200"
                {...register('firstMass')}
                sx={inputFieldStyles}
              />
              <FormErrorMessage>
                <Text>{errors.firstMass?.message}</Text>
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
              isDisabled={firstMassMutation.isLoading}
            >
              {firstMassMutation.isLoading ? (
                <Spinner color="orange" emptyColor="lightgreen" />
              ) : (
                'Submit'
              )}
            </Button>
          </Flex>
          </Stack>
        </form>
    </Container>
  );
};
export default FirstMassForm;
