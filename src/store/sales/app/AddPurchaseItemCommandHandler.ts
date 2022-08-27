import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import { AddPurchaseItemData } from './AddPurchaseItemCommand';

export default class AddPurchaseItemCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  constructor(repository: IPurchaseOrderRepository) {
    this.repository = repository;
  }

  public async handle(data: EventData<AddPurchaseItemData>): Promise<void | boolean> {
    // TODO: improve this logic

    console.info(data);

    const draftPurchaseOrder = await this.repository.getDraftPurchaseOrderByClientId(data.clientId);

    const purchaseOrderItem = new PurchaseOrderItem({
      id: 'asdfa',
      product: new Product(data.productId, data.productName, data.productAmount),
      quantity: data.quantity,
    });

    if (!draftPurchaseOrder) {
      const newDraftPurchaseOrder = PurchaseOrder.createDraft({
        clientId: data.clientId,
        createdAt: new Date(),
        code: 123,
        id: 'asdfs',
      });

      newDraftPurchaseOrder.addItem(purchaseOrderItem);

      return true;
    }

    const exists = draftPurchaseOrder.hasItem(purchaseOrderItem);
    draftPurchaseOrder.addItem(purchaseOrderItem);

    if (exists) {
      await this.repository.updatePurchaseOrderItem(
        draftPurchaseOrder.items.find((i) => i.product.id === purchaseOrderItem.product.id)!,
      );

      return true;
    }

    await this.repository.addPurchaseOrderItem(purchaseOrderItem);

    return true;
  }
}
