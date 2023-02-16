import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { GetPurchaseOrderParams } from './GetPurchaseOrderQuery';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
// eslint-disable-next-line max-len
export default class GetPurchaseOrderQueryHandler implements IHandler<Results<PurchaseOrder>, GetPurchaseOrderParams> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(params: GetPurchaseOrderParams): Promise<Results<PurchaseOrder>> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(params.purchaseOrderId);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    return { results: [purchaseOrder] };
  }
}
