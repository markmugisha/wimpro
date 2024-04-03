import {
  chakra,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spinner,
  Stack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from 'react-query';

import { createQaData } from '../../../api/client';
import { errorToast } from '../../../toasts';

const zNull = z
  .string()
  .trim()
  .length(0)
  .transform(() => null);
const zPercent = z.coerce.number().min(0).max(100).optional();

const createQASchema = z.object({
  moistureContent: zNull.or(zPercent),
  ppb: zNull.or(zPercent),
  ppm: zNull.or(zPercent),
  ddn: zNull.or(zPercent),
  coloration: zNull.or(zPercent),
  insectOrvermin: zNull.or(zPercent),
  brokenGrain: zNull.or(zPercent),
  immatureShrivelled: zNull.or(zPercent),
  rottenOrDiseased: zNull.or(zPercent),
  organicMatter: zNull.or(zPercent),
  inorganicMatter: zNull.or(zPercent),
  filth: zNull.or(zPercent),
  contrastingVarieties: zNull.or(zPercent),
  pesticideResidues: zNull.or(z.coerce.number().min(0).max(10).optional()),
  heatDamaged: zNull.or(zPercent),
});

function Assess({ row, onSubmit }) {
  const queryClient = useQueryClient();
  const {
    register,
    reset,
    handleSubmit: hookFormSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createQASchema) });

  const toast = useToast();

  const qaDataMutation = useMutation((data) => createQaData(data), {
    onSuccess() {
      queryClient.invalidateQueries(['pending-qa']);
      queryClient.invalidateQueries(['pending-second-mass']);
      reset();
      onSubmit();
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
    data.lotId = row.lotId;
    qaDataMutation.mutate(data);
  };

  return (
    <Container py={0} maxW="5xl" centerContent width={'100%'} pt={12}>
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
            {' '}
            <chakra.span fontSize="1rem" fontWeight="light">
              Lot No.
            </chakra.span>{' '}
            {row?.lotId}{' '}
            <chakra.span fontSize="1rem" fontWeight="light">
              Quality Assessment
            </chakra.span>{' '}
          </Heading>
          <Stack
            direction={{ base: 'column', md: 'row' }}
            justifyContent="center"
            alignContent="center"
            width="100%"
            spacing={7}
          >
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.moistureContent}>
                <FormLabel sx={inputLabelStyles}>MC (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('moistureContent')} />
                <FormErrorMessage>
                  {errors.moistureContent?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.ppb}>
                <FormLabel sx={inputLabelStyles}>PPB (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('ppb')} />
                <FormErrorMessage>{errors.ppb?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.ppm}>
                <FormLabel sx={inputLabelStyles}>PPM (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('ppm')} />
                <FormErrorMessage>{errors.ppm?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.ddn}>
                <FormLabel sx={inputLabelStyles}>DDN (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('ddn')} />
                <FormErrorMessage>{errors.ddn?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.coloration}>
                <FormLabel sx={inputLabelStyles}>Coloraration (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('coloration')} />
                <FormErrorMessage>
                  {errors.coloration?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.insectOrvermin}>
                <FormLabel sx={inputLabelStyles}>
                  Insect or Vermin Damage(%)
                </FormLabel>
                <Input sx={inputFieldStyles} {...register('insectOrvermin')} />
                <FormErrorMessage>
                  {errors.insectOrvermin?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.brokenGrain}>
                <FormLabel sx={inputLabelStyles}>Broken Grain (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('brokenGrain')} />
                <FormErrorMessage>
                  {errors.brokenGrain?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.immatureShrivelled}>
                <FormLabel sx={inputLabelStyles}>
                  Immature/Shrivelled(%)
                </FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('immatureShrivelled')}
                />
                <FormErrorMessage>
                  {errors.immatureShrivelled?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.rottenOrDiseased}>
                <FormLabel sx={inputLabelStyles}>
                  Rotten & Diseased (%)
                </FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('rottenOrDiseased')}
                />
                <FormErrorMessage>
                  {errors.rottenOrDiseased?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.organicMatter}>
                <FormLabel sx={inputLabelStyles}>Organic matter (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('organicMatter')} />
                <FormErrorMessage>
                  {errors.organicMatter?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
            <VStack width={{ base: '100%', md: '250px' }} spacing={3} mb={6}>
              <FormControl isInvalid={errors.inorganicMatter}>
                <FormLabel sx={inputLabelStyles}>
                  Inorganic matter (%)
                </FormLabel>
                <Input sx={inputFieldStyles} {...register('inorganicMatter')} />
                <FormErrorMessage>
                  {errors.inorganicMatter?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.filth}>
                <FormLabel sx={inputLabelStyles}>Filth (%)</FormLabel>
                <Input sx={inputFieldStyles} {...register('filth')} />
                <FormErrorMessage>{errors.filth?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.contrastingVarieties}>
                <FormLabel sx={inputLabelStyles}>
                  Contrasting varieties (% m/m)
                </FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('contrastingVarieties')}
                />
                <FormErrorMessage>
                  {errors.contrastingVarieties?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.pesticideResidues}>
                <FormLabel sx={inputLabelStyles}>
                  Pesticide residues (mg/kg)
                </FormLabel>
                <Input
                  sx={inputFieldStyles}
                  {...register('pesticideResidues')}
                />
                <FormErrorMessage>
                  {errors.pesticideResidues?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.heatDamaged}>
                <FormLabel sx={inputLabelStyles}>
                  Heat damaged (% m/m)
                </FormLabel>
                <Input sx={inputFieldStyles} {...register('heatDamaged')} />
                <FormErrorMessage>
                  {errors.heatDamaged?.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Stack>
          <Flex justifyContent="center" alignContent="center">
            <Button
              isDisabled={qaDataMutation.isLoading}
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
              {qaDataMutation.isLoading ? (
                <>
                  {'Submitting QA data'}{' '}
                  <Spinner color="orange" emptyColor="lightgreen" />
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </Flex>
        </Stack>
      </form>
    </Container>
  );
}

export default Assess;
