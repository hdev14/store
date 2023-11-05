import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { PurchaseOrderItemProps } from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import GetPurchaseOrderItemQuery from '../queries/GetPurchaseOrderItemQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemQueryHandler implements IHandler<GetPurchaseOrderItemQuery, PurchaseOrderItemProps> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrderItemQuery): Promise<PurchaseOrderItemProps> {
    const purchase_order_item = await this.repository
      .getPurchaseOrderItemById(event.purchase_order_item_id);

    if (!purchase_order_item) {
      throw new PurchaseOrderItemNotFoundError();
    }

    return purchase_order_item.toObject();
  }
}
