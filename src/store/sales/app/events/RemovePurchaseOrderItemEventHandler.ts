import { IPurchaseOrderRepositoryCommands } from '@sales/domain/IPurchaseOrderRepository';
import IEventHandler, { EventData } from '@shared/abstractions/IEventHandler';
import EventHandlerError from '@shared/errors/EventHandlerError';

// eslint-disable-next-line max-len
export default class RemovePurchaseOrderItemEventHandler implements IEventHandler {
  constructor(private readonly repository: IPurchaseOrderRepositoryCommands) { }

  public async handle(data: EventData): Promise<void> {
    try {
      await this.repository.deletePurchaseOrderItem(data.principalId);
    } catch (e: any) {
      console.error(e.stack);
      throw new EventHandlerError('Erro ao excluir um item.');
    }
  }
}
