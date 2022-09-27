import { EventData, IEventHandler } from '@shared/@types/events';

export default class RemovePurchaseOrderItemCommandHandler implements IEventHandler<boolean> {
  public async handle(data: EventData): Promise<boolean> {
    console.info(data);
    return Promise.resolve(false);
  }
}
