import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import GetPurchaseOrderQuery from '../queries/GetPurchaseOrderQuery';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';

// eslint-disable-next-line max-len
export default class GetPurchaseOrderQueryHandler implements IHandler<GetPurchaseOrderQuery, PurchaseOrder> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrderQuery): Promise<PurchaseOrder> {
    const purchaseOrder = await this.repository.getPurchaseOrderById(event.purchaseOrderId);

    if (!purchaseOrder) {
      throw new PurchaseOrderNotFoundError();
    }

    return purchaseOrder;
  }
}
