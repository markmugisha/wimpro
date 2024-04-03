import 'dotenv/config.js';
import '../models/index.js';

import { Op } from 'sequelize';
import { InvalidOrderError } from '../errors/index.js';
import {
  Batch,
  BatchItem,
  GrainType,
  Order,
  OrderItem,
} from '../models/index.js';

async function orderPickingPlan(orderId) {
  const order = await Order.findOne({
    where: { id: orderId, status: 'pending' },
    include: { model: OrderItem, include: GrainType },
  });

  if (!order) {
    throw new InvalidOrderError();
  }

  const pickingPlans = order.orderItems.map(async (orderItem) => {
    let pickingPlan = {
      bagsPicked: [
        // {batchItemId, stackNumber, numberOfBags}
      ],
      remainingBags: orderItem.numberOfBags,
      grainType: orderItem.grainType.name,
      weightPerBag: orderItem.weightPerBag,
      numberOfBags: orderItem.numberOfBags,
    };

    const batchItems = await BatchItem.findAll({
      where: {
        weightPerBag: orderItem.weightPerBag,
        numberOfBags: {
          [Op.gt]: 0,
        },
      },
      include: {
        model: Batch,
        where: { branchId: order.branchId, grainTypeId: orderItem.grainTypeId },
        required: true,
      },
      order: [[Batch, 'dateCreated', 'ASC']],
    });

    for (const batchItem of batchItems) {
      const bagsRemainingToBePicked =
        pickingPlan.remainingBags - batchItem.numberOfBags;

      const stackPick = {
        batchItemId: batchItem.id,
        stackNumber: batchItem.stackNumber,
      };

      // more bags need to be picked, current stack is not enough to fulfil the need (pickingPlan.remainingBags)
      if (bagsRemainingToBePicked > 0) {
        // entire current stack is picked, as it cannot fulfil the order need
        stackPick.numberOfBags = batchItem.numberOfBags;
        pickingPlan.bagsPicked.push(stackPick);

        // update the need for next iteration
        pickingPlan.remainingBags = bagsRemainingToBePicked;
      }
      // current stack fulfils the need
      else {
        // we only pick as much as needed (equal to the need), because current stack can fulfil the need,
        stackPick.numberOfBags = pickingPlan.remainingBags;
        pickingPlan.bagsPicked.push(stackPick);

        // no more bags need to be picked, because current stack can fulfil the need,
        pickingPlan.remainingBags = 0;
        break;
      }
    }
    return pickingPlan;
  });

  const resolvedPlan = await Promise.all(pickingPlans);
  const isPlanSatisfied = resolvedPlan.every(
    (orderItemPlan) => orderItemPlan.remainingBags === 0
  );

  return { isPlanSatisfied, plan: resolvedPlan };
}

export default orderPickingPlan;
