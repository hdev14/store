import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { GetPurchaseOrderItemsParams } from './GetPurchaseOrderItemsQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemsQueryHandler implements IHandler<Results<PurchaseOrderItem>, GetPurchaseOrderItemsParams> {
  public async handle(_params: GetPurchaseOrderItemsParams): Promise<Results<PurchaseOrderItem>> {
    throw new Error('Method not implemented.');
  }
}
