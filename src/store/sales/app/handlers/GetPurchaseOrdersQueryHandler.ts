import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { PurchaseOrderProps } from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import GetPurchaseOrdersQuery from '../queries/GetPurchaseOrdersQuery';

// eslint-disable-next-line max-len
export default class GetPurchaseOrdersQueryHandler implements IHandler<GetPurchaseOrdersQuery, PurchaseOrderProps[]> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrdersQuery): Promise<PurchaseOrderProps[]> {
    const purchase_orders = await this.repository.getPurchaseOrdersByCustomerId(event.customerId);

    const results: PurchaseOrderProps[] = [];

    for (const purchase_order of purchase_orders) {
      results.push(purchase_order.toObject());
    }

    return results;
  }
}
