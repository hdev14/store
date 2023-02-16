import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import PurchaseOrderItemNotFoundError from '../PurchaseOrderItemNotFoundError';
import { GetPurchaseOrderItemParams } from './GetPurchaseOrderItemQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemQueryHandler implements IHandler<Results<PurchaseOrderItem>, GetPurchaseOrderItemParams> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(params: GetPurchaseOrderItemParams): Promise<Results<PurchaseOrderItem>> {
    const purchaseOrderItem = await this.repository
      .getPurchaseOrderItemById(params.purchaseOrderItemId);

    if (!purchaseOrderItem) {
      throw new PurchaseOrderItemNotFoundError();
    }

    return { results: [purchaseOrderItem] };
  }
}
