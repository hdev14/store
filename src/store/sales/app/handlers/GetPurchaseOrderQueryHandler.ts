import { IPurchaseOrderRepositoryQueries } from '@sales/domain/IPurchaseOrderRepository';
import { PurchaseOrderProps } from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import PurchaseOrderNotFoundError from '../PurchaseOrderNotFoundError';
import GetPurchaseOrderQuery from '../queries/GetPurchaseOrderQuery';

export default class GetPurchaseOrderQueryHandler implements IHandler<GetPurchaseOrderQuery, PurchaseOrderProps> {
  constructor(private readonly repository: IPurchaseOrderRepositoryQueries) { }

  public async handle(event: GetPurchaseOrderQuery): Promise<PurchaseOrderProps> {
    const purchase_order = await this.repository.getPurchaseOrderById(event.purchase_order_id);

    if (!purchase_order) {
      throw new PurchaseOrderNotFoundError();
    }

    return purchase_order.toObject();
  }
}
