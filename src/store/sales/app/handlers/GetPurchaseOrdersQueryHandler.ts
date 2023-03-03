import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import GetPurchaseOrdersQuery from '../queries/GetPurchaseOrdersQuery';

// TODO: change return
// eslint-disable-next-line max-len
export default class GetPurchaseOrdersQueryHandler implements IHandler<GetPurchaseOrdersQuery, PurchaseOrder[]> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrdersQuery): Promise<PurchaseOrder[]> {
    const purchaseOrders = await this.repository.getPurchaseOrdersByCustomerId(event.customerId);

    return purchaseOrders;
  }
}
