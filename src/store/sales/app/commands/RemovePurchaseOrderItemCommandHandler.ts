import { EventData, IEventHandler } from '@shared/@types/events';
import { RemovePurchaseOrderItemCommandData } from './RemovePurchaseOrderItemCommand';

// TODO: finish logic
export default class RemovePurchaseOrderItemCommandHandler implements IEventHandler<boolean> {
  public async handle(data: EventData<RemovePurchaseOrderItemCommandData>): Promise<boolean> {
    console.info(data);
    return Promise.resolve(false);
  }
}
