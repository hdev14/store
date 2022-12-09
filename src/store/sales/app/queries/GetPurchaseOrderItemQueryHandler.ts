import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { GetPurchaseOrderItemParams } from './GetPurchaseOrderItemQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderItemQueryHandler implements IHandler<Results<PurchaseOrderItem>, GetPurchaseOrderItemParams> {
  public async handle(_params: GetPurchaseOrderItemParams): Promise<Results<PurchaseOrderItem>> {
    throw new Error('Method not implemented.');
  }
}
