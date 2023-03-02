import RemovePurchaseOrderItemEvent from '@sales/domain/events/RemovePurchaseOrderItemEvent';
import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IHandler from '@shared/abstractions/IHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemEventHandler implements IHandler<RemovePurchaseOrderItemEvent> {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(event: RemovePurchaseOrderItemEvent): Promise<any> {
    try {
      await this.repository.deletePurchaseOrderItem(event.principalId);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao excluir um item.');
    }
  }
}
