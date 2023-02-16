import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { Results } from '@shared/abstractions/Query';
import { GetPurchaseOrdersParams } from './GetPurchaseOrdersQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrdersQueryHandler implements IHandler<Results<PurchaseOrder>, GetPurchaseOrdersParams> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) {
    this.repository = repository;
  }

  public async handle(params: GetPurchaseOrdersParams): Promise<Results<PurchaseOrder>> {
    const purchaseOrders = await this.repository.getPurchaseOrdersByCustomerId(params.customerId);

    return { results: purchaseOrders };
  }
}
