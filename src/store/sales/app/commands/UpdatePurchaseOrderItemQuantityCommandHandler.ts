import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdatePurchaseOrderItemQuantityCommandData } from './UpdatePurchaseOrderItemQuantityCommand';

// TODO: finish logic
// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IEventHandler<boolean> {
  public async handle(
    data: EventData<UpdatePurchaseOrderItemQuantityCommandData>,
  ): Promise<boolean> {
    console.info(data);
    return Promise.resolve(false);
  }
}
