import * as z from 'zod';
import {
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  // Spinner,
  Stack,
  Text,
  VStack,
  useToast,
  // useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { AiFillDelete } from 'react-icons/ai';

import { addOrder, getGrainTypes } from '../../../api/client';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { parsePhoneNumber } from 'libphonenumber-js';
import { errorToast, successToast } from '../../../toasts';
import { useEffect } from 'react';

const zNull = z
  .string()
  .trim()
  .length(0, 'Number required')
  .transform(() => null);

const numberOfBagsSchema = z.coerce
  .number()
  .int('Number of bags must be a positive whole number')
const weightPerBagSchema = z.coerce
  .number()
  .int('Number of bags must be a positive whole number')
const orderSchema = z
  .object({
    orderItems: z
      .array(
        z.object({
          grainTypeId: z.coerce
            .number()
            .positive('Please enter the grain type.'),
          totalWeight: z.coerce
            .number()
            .positive('Enter the production total weight'),
          numberOfBags: numberOfBagsSchema.positive('Number of bags must be a positive whole number'),
          weightPerBag: weightPerBagSchema.positive('Number of bags must be a positive whole number'),
        })
      )
      .min(1, 'At least one order item is required'),
    customerName: z.string().trim().nonempty('Supplier name is required'),
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
    dispatchType: z.string().trim().nonempty('Dispatch Type is required!'),
    invoiceNumber: z.string().trim().nonempty('Invoice Number is required!'),
    receiptNumber: z.string().trim().nonempty('Receipt Number is required!'),
    payment: z.string().trim().nonempty('Payment is required!'),
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

const SalesOrderForm = () => {
  const {
    handleSubmit: hookFormSubmit,
    register,
    watch,
    setValue,
    clearErrors,
    reset,
    control,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderItems: [
        {
          grainTypeId: '',
          totalWeight: '',
          numberOfBags: '',
          weightPerBag: '',
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'orderItems',
  });
  const toast = useToast();

  const orderMutation = useMutation((data) => addOrder(data), {
    onSuccess() {
      toast(
        successToast(
          'Order Submitted',
          'Order successfully submitted for processing'
        )
      );
      reset();
      reset({
        orderItems: [
          {
            grainTypeId: '',
            totalWeight: '',
            numberOfBags: '',
            weightPerBag: '',
          },
        ],
      });
    },
    onError(error) {
      if (error.errorCode === 'no-silo-inventory') {
        toast(
          errorToast(
            'No silo inventory.',
            error.response?.data?.message || error.message
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

  const grainTypes = useQuery(['grain-types'], () => getGrainTypes());

  const orderItems = z
    .array(
      z.object({
        numberOfBags: numberOfBagsSchema.optional(),
        weightPerBag: weightPerBagSchema.optional(),
      })
    )
    .safeParse(watch('orderItems'));

  const calculate = () => {
    orderItems.data?.forEach((item, index) => {
      if (!item.numberOfBags || !item.weightPerBag || item.numberOfBags < 0 || item.weightPerBag < 0) {
        setValue(`orderItems.${index}.totalWeight`, '', {
          shouldValidate: isSubmitted,
        });
        return;
      }
      setValue(
        `orderItems.${index}.totalWeight`,
        item.numberOfBags * item.weightPerBag
      );
      clearErrors(`orderItems.${index}.totalWeight`);
    });
  };

  useDeepCompareEffect(calculate, [orderItems]);

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

  const inputOrderItemStyles = {
    fontSize: '0.8rem',
    h: '35px',
    border: '1px solid lightgrey',
    alignItems: 'center',
    // marginLeft: 'auto',
    // marginRight: 'auto',
    _invalid: { border: '1px', borderColor: 'red.500', boxShadow: '0 0 0 0' },
  };

  const inputLabelStyles = {
    fontSize: '0.9rem',
    marginBottom: '0',
  };

  const inputOrderItemLabelStyles = {
    fontSize: '0.9rem',
    fontWeight: 'light',
    marginBottom: '0',
  };

  const handleSubmit = async (data) => {
    orderMutation.mutate(data);
  };
  return (
    <Container
      py={3}
      // mt={}
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
      <form onSubmit={hookFormSubmit(handleSubmit)}>
        <Heading size="md">Order Request</Heading>

        <Stack
          p={{ base: 2, sm: 4, lg: 4 }}
          margin="auto"
          direction={{ base: 'column', md: 'row' }}
          justifyContent="center"
          alignContent="center"
          width="100%"
          spacing={{ md: 20 }}
        >
          <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={3}>
            <FormControl isInvalid={errors.invoiceNumber}>
              <FormLabel sx={inputLabelStyles}>Invoice Number</FormLabel>
              <Input {...register('invoiceNumber')} sx={inputFieldStyles} />
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.invoiceNumber?.message}</Text>
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.dispatchType}>
              <FormLabel sx={inputLabelStyles}>Dispatch Type</FormLabel>
              <Select
                placeholder="Choose dispatch type"
                {...register('dispatchType')}
                sx={inputFieldStyles}
              >
                <option value="external">External</option>
                <option value="internal">Internal</option>
              </Select>
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.dispatchType?.message}</Text>
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.customerName}>
              <FormLabel sx={inputLabelStyles}>Customer Name</FormLabel>
              <Input {...register('customerName')} sx={inputFieldStyles} />
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.customerName?.message}</Text>
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <FormLabel sx={inputLabelStyles}>Email</FormLabel>
              <Input
                type="email"
                placeholder="eg company@email.com"
                {...register('email')}
                sx={inputFieldStyles}
              />
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.email?.message}</Text>
              </FormErrorMessage>
            </FormControl>
          </VStack>
          <VStack width={{ base: '100%', md: '300px' }} spacing={3} mb={6}>
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
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.countryPhoneCode?.message}</Text>
              </FormErrorMessage>
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.phoneNumber?.message}</Text>
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.receiptNumber}>
              <FormLabel sx={inputLabelStyles}>Receipt Number</FormLabel>
              <Input {...register('receiptNumber')} sx={inputFieldStyles} />
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.receiptNumber?.message}</Text>
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.payment}>
              <FormLabel sx={inputLabelStyles}>Payment</FormLabel>
              <Select
                placeholder="Confirm payment"
                {...register('payment')}
                sx={inputFieldStyles}
              >
                <option value="yes">YES</option>
                <option value="no">No</option>
              </Select>
              <FormErrorMessage fontSize="0.7rem">
                <Text>{errors.payment?.message}</Text>
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </Stack>
        <VStack mb={5}>
          <Heading size="md" fontSize="lg" fontWeight="light">
            Order Specifications
          </Heading>
          {fields.map((field, index) => (
            <Flex
              key={field.id}
              gap={3}
              flexDirection={{ base: 'column', md: 'row' }}
              w="full"
            >
              <FormControl isInvalid={errors.orderItems?.[index]?.grainTypeId}>
                <FormLabel
                  sx={inputOrderItemLabelStyles}
                  display={{ md: index !== 0 && 'none' }}
                >
                  Grain Type
                </FormLabel>
                <Select
                  placeholder="Choose grain type"
                  {...register(`orderItems.${index}.grainTypeId`)}
                  sx={inputOrderItemStyles}
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
                  <Text>
                    {errors.orderItems?.[index]?.grainTypeId?.message}
                  </Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.orderItems?.[index]?.numberOfBags}>
                <FormLabel
                  sx={inputOrderItemLabelStyles}
                  display={{ md: index !== 0 && 'none' }}
                >
                  No of Bags
                </FormLabel>
                <Input
                  {...register(`orderItems.${index}.numberOfBags`)}
                  sx={inputOrderItemStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>
                    {errors.orderItems?.[index]?.numberOfBags?.message}
                  </Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.orderItems?.[index]?.weightPerBag}>
                <FormLabel
                  sx={inputOrderItemLabelStyles}
                  display={{ md: index !== 0 && 'none' }}
                >
                  Weight per bag
                </FormLabel>
                <Input
                  {...register(`orderItems.${index}.weightPerBag`)}
                  sx={inputOrderItemStyles}
                />
                <FormErrorMessage fontSize="0.7rem">
                  <Text>
                    {errors.orderItems?.[index]?.weightPerBag?.message}
                  </Text>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.orderItems?.[index]?.totalWeight}>
                <FormLabel
                  sx={inputOrderItemLabelStyles}
                  display={{ md: index !== 0 && 'none' }}
                >
                  Total Weight
                </FormLabel>
                <Input
                  fontSize="0.8rem"
                  h="35px"
                  border="1px solid lightgrey"
                  borderBottom="3px solid #fb8e19"
                  // borderBottomColor="orange.300"
                  // borderBottomWidth={3}
                  {...register(`orderItems.${index}.totalWeight`)}
                  readOnly
                />
                <FormErrorMessage fontSize="0.7rem">
                  {errors.orderItems?.[index]?.totalWeight?.message}
                </FormErrorMessage>
              </FormControl>
              <IconButton
                variant="ghost"
                icon={<AiFillDelete color="#AA0000" />}
                onClick={index === 0 ? null : () => remove(index)}
                alignSelf={errors.orderItems?.[index] ? 'center' : 'flex-end'}
                visibility={index === 0 ? 'hidden' : 'inherit'}
              />
            </Flex>
          ))}
          <Text color="red.500">{errors.orderItems?.message}</Text>
          <Flex width="full" justifyContent="left">
            <Button
              type="button"
              size="sm"
              fontWeight="light"
              backgroundColor="#F0E68C"
              // color="white"
              onClick={append}
            >
              ✛ Add Item
            </Button>
          </Flex>
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
            // isDisabled={dailyProductionMutation.isLoading}
          >
            {' '}
            Submit
            {/* {dailyProductionMutation.isLoading ? <Spinner /> : 'Submit'} */}
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
export default SalesOrderForm;
