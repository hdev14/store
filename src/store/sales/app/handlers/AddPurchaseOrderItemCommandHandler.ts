import crypto from 'crypto';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import IEventQueue from '@shared/abstractions/IEventQueue';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
import AddPurchaseOrderItemCommand from '../commands/AddPurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommandHandler implements IHandler<AddPurchaseOrderItemCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventQueue: IEventQueue,
  ) { }

  public async handle(event: AddPurchaseOrderItemCommand): Promise<void> {
    const purchaseOrderItem = new PurchaseOrderItem({
      id: crypto.randomUUID(),
      product: {
        id: event.productId,
        name: event.productName,
        amount: event.productAmount,
      },
      quantity: event.quantity,
    });

    const draftPurchaseOrder = await this.repository
      .getDraftPurchaseOrderByCustomerId(event.customerId);

    if (!draftPurchaseOrder) {
      await this.createNewDraftPurcahseOrder(event.customerId, purchaseOrderItem);
      return;
    }

    await this.updatePurchaseOrder(draftPurchaseOrder, purchaseOrderItem);
  }

  private async updatePurchaseOrder(
    draftPurchaseOrder: PurchaseOrder,
    purchaseOrderItem: PurchaseOrderItem,
  ): Promise<void> {
    const exists = draftPurchaseOrder.hasItem(purchaseOrderItem);
    draftPurchaseOrder.addItem(purchaseOrderItem);

    if (exists) {
      const addedPurchaseOrderItem = draftPurchaseOrder.items.find(
        (i) => i.product.id === purchaseOrderItem.product.id,
      )!;

      await this.repository.updatePurchaseOrderItem(addedPurchaseOrderItem);

      this.eventQueue.enqueue(new UpdatePurchaseOrderItemEvent(
        addedPurchaseOrderItem.id,
        addedPurchaseOrderItem.quantity,
        addedPurchaseOrderItem.product.id,
        addedPurchaseOrderItem.product.name,
        addedPurchaseOrderItem.product.amount,
      )).catch(console.error.bind(console));
    } else {
      await this.repository.addPurchaseOrderItem(purchaseOrderItem);

      this.eventQueue.enqueue(new AddPurchaseOrderItemEvent(
        purchaseOrderItem.id,
        purchaseOrderItem.purchaseOrderId,
        purchaseOrderItem.quantity,
        purchaseOrderItem.product.id,
        purchaseOrderItem.product.name,
        purchaseOrderItem.product.amount,
      )).catch(console.error.bind(console));
    }

    await this.repository.updatePurchaseOrder(draftPurchaseOrder);

    this.eventQueue.enqueue(new UpdateDraftPurchaseOrderEvent(
      draftPurchaseOrder.id,
      draftPurchaseOrder.customerId,
      draftPurchaseOrder.code,
      draftPurchaseOrder.totalAmount,
      draftPurchaseOrder.discountAmount,
    )).catch(console.error.bind(console));
  }

  private async createNewDraftPurcahseOrder(
    customerId: string,
    purchaseOrderItem: PurchaseOrderItem,
  ): Promise<void> {
    const code = await this.repository.countPurchaseOrders() + 1;

    const newDraftPurchaseOrder = PurchaseOrder.createDraft({
      id: crypto.randomUUID(),
      customerId,
      createdAt: new Date(),
      code,
      voucher: null,
      status: null,
      items: [],
    });

    newDraftPurchaseOrder.addItem(purchaseOrderItem);

    await this.repository.addPurchaseOrder(newDraftPurchaseOrder);

    await this.repository.addPurchaseOrderItem(purchaseOrderItem);

    this.eventQueue.enqueueInBatch([
      new AddDraftPurchaseOrderEvent(
        newDraftPurchaseOrder.id,
        newDraftPurchaseOrder.customerId,
        newDraftPurchaseOrder.totalAmount,
        newDraftPurchaseOrder.discountAmount,
        newDraftPurchaseOrder.createdAt,
        newDraftPurchaseOrder.code,
      ),
      new AddPurchaseOrderItemEvent(
        purchaseOrderItem.id,
        purchaseOrderItem.purchaseOrderId,
        purchaseOrderItem.quantity,
        purchaseOrderItem.product.id,
        purchaseOrderItem.product.name,
        purchaseOrderItem.product.amount,
      ),
    ]).catch(console.error.bind(console));
  }
}
