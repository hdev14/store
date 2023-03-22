import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { PurchaseOrderItemProps } from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import GetPurchaseOrderItemQuery from '../queries/GetPurchaseOrderItemQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemQueryHandler implements IHandler<GetPurchaseOrderItemQuery, PurchaseOrderItemProps> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrderItemQuery): Promise<PurchaseOrderItemProps> {
    const purchaseOrderItem = await this.repository
      .getPurchaseOrderItemById(event.purchaseOrderItemId);

    if (!purchaseOrderItem) {
      throw new PurchaseOrderItemNotFoundError();
    }

    return purchaseOrderItem.toObject();
  }
}
