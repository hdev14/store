import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import { EventData, IEventHandler } from '@shared/@types/events';
import { UpdatePurchaseOrderItemQuantityCommandData } from './UpdatePurchaseOrderItemQuantityCommand';

// eslint-disable-next-line max-len
export default class UpdatePurchaseOrderItemQuantityCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(
    data: EventData<UpdatePurchaseOrderItemQuantityCommandData>,
  ): Promise<boolean> {
    const purchaseOrderItem = await this.repository.getPurchaseOrderItemById(data.principalId);

    return Promise.resolve(false);
  }
}
