import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getOrderPickingPlan, pickOrder } from '../../../api/client';
import { useEffect, useState } from 'react';

function OrderPickingPlan({ disclosure, order }) {
  const { isOpen, onClose } = disclosure;

  const [isPicking, setIsPicking] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsPicking(false);
  }, [isOpen]);

  const pickingPlanQuery = useQuery(['order-picking-plan', order.id], () =>
    getOrderPickingPlan(order.id)
  );

  const pickOrderMutation = useMutation((orderId) => pickOrder(orderId), {
    onSuccess() {
      queryClient.invalidateQueries(['pending-orders']);
      queryClient.invalidateQueries(['stock']);
    },
  });

  const handlePick = () => {
    setIsPicking(true);
    pickOrderMutation.mutate(order.id);
  };

  const handleRegeneratePlan = () => {
    setIsPicking(false);
    queryClient.invalidateQueries(['order-picking-plan', order.id]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="md" fontWeight="semibold">
            Picking plan for order{' '}
            <chakra.span fontWeight="normal">
              #{order.invoiceNumber}
            </chakra.span>
          </Heading>
        </ModalHeader>
        <ModalBody>
          {!isPicking && renderPickingPlan()}
          {isPicking && renderPicking()}
        </ModalBody>
        <ModalFooter>
          {!isPicking &&
            pickingPlanQuery.isSuccess &&
            pickingPlanQuery.data.isPlanSatisfied && (
              <Button
                maxW="160px"
                w="full"
                borderRadius="2px 10px 0 10PX"
                boxShadow="5px 5px 5px 1px lightgrey"
                color="white"
                backgroundColor="green.500"
                fontWeight="light"
                _hover={{ backgroundColor: 'green.600' }}
                onClick={handlePick}
              >
                Pick
              </Button>
            )}
          {isPicking && pickOrderMutation.isSuccess && (
            <Button
              maxW="160px"
              w="full"
              borderRadius="2px 10px 0 10PX"
              boxShadow="5px 5px 5px 1px lightgrey"
              color="white"
              backgroundColor="green.500"
              fontWeight="light"
              _hover={{ backgroundColor: 'green.600' }}
              onClick={onClose}
            >
              Okay
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  function renderPickingPlan() {
    return (
      <>
        {pickingPlanQuery.isLoading && <Spinner />}
        {pickingPlanQuery.isError && (
          <Text>
            Failed to get picking plan. This is usually because the order has
            already been picked.
          </Text>
        )}
        {pickingPlanQuery.isSuccess && (
          <Flex flexDir="column" gap={5}>
            {pickingPlanQuery.data.plan.map((orderItemPlan) => (
              <Box key={orderItemPlan.id}>
                <Heading as="h2" size="sm" fontWeight="semibold">
                  {orderItemPlan.grainType}({orderItemPlan.weightPerBag}kgs) -{' '}
                  {Intl.NumberFormat().format(orderItemPlan.numberOfBags)} bags
                </Heading>
                {renderPlan(
                  orderItemPlan.bagsPicked,
                  orderItemPlan.remainingBags
                )}
              </Box>
            ))}
          </Flex>
        )}
      </>
    );
  }

  function renderPlan(bagsPicked, deficit) {
    return (
      <>
        {bagsPicked.map((stack, i) => (
          <Text key={i}>
            Stack: {stack.stackNumber} -{' '}
            {Intl.NumberFormat().format(stack.numberOfBags)} bags
          </Text>
        ))}
        {deficit > 0 && (
          <Text color="red.400">
            Deficit - {Intl.NumberFormat().format(deficit)} bags
          </Text>
        )}
      </>
    );
  }

  function renderPicking() {
    return (
      <>
        {pickOrderMutation.isLoading && <Spinner />}
        {pickOrderMutation.isError && (
          <VStack gap={5}>
            <Text>
              Failed to pick the order. It is likely there have been changes to
              the stacks in the picking plan and the picking plan needs to be
              regenerated or the order has already been picked.
            </Text>
            <Button onClick={handleRegeneratePlan}>Regenerate plan</Button>
          </VStack>
        )}
        {pickOrderMutation.isSuccess && <Text>Order successfully picked</Text>}
      </>
    );
  }
}
export default OrderPickingPlan;
