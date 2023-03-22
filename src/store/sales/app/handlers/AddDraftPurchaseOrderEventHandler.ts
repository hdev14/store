import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class AddDraftPurchaseOrderEventHandler implements IHandler<AddDraftPurchaseOrderEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: AddDraftPurchaseOrderEvent): Promise<any> {
    try {
      const draftPurchaseOrder = PurchaseOrder.createDraft({
        id: event.principalId,
        code: event.code,
        customerId: event.customerId,
        totalAmount: event.totalAmount,
        discountAmount: event.discountAmount,
        createdAt: event.createdAt,
        status: null,
        voucher: null,
        items: [],
      });

      await this.repository.addPurchaseOrder(draftPurchaseOrder);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao cadastrar o pedido.', { cause: e.stack });
    }
  }
}
