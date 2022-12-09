import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { GetPurchaseOrdersParams } from './GetPurchaseOrdersQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrdersQueryHandler implements IHandler<Results<PurchaseOrder>, GetPurchaseOrdersParams> {
  public async handle(_params: GetPurchaseOrdersParams): Promise<Results<PurchaseOrder>> {
    throw new Error('Method not implemented.');
  }
}
