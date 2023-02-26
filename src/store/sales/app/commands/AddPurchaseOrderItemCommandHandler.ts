import crypto from 'crypto';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import IHandler from '@shared/abstractions/IHandler';
import IEventQueue from '@shared/abstractions/IEventQueue';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import AddPurchaseOrderItemCommand from './AddPurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommandHandler implements IHandler<AddPurchaseOrderItemCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventQueue: IEventQueue,
  ) { }

  public async handle(event: AddPurchaseOrderItemCommand): Promise<void> {
    const purchaseOrderItem = new PurchaseOrderItem({
      id: crypto.randomUUID(),
      product: new Product(
        event.productId,
        event.productName,
        event.productAmount,
      ),
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

      // this.eventPublisher.addEvent<AddPurchaseOrderItemEventData>(
      //   AddPurchaseOrderItemEvent,
      //   {
      //     principalId: purchaseOrderItem.id,
      //     productId: purchaseOrderItem.product.id,
      //     productName: purchaseOrderItem.product.name,
      //     productAmount: purchaseOrderItem.product.amount,
      //     purchaseOrderId: purchaseOrderItem.purchaseOrderId,
      //     quantity: purchaseOrderItem.quantity,
      //     timestamp: new Date().toISOString(),
      //   },
      // );
    }

    await this.repository.updatePurchaseOrder(draftPurchaseOrder);

    // this.eventPublisher.addEvent<UpdateDraftPurchaseOrderEventData>(
    //   UpdateDraftPurchaseOrderEvent,
    //   {
    //     principalId: draftPurchaseOrder.id,
    //     customerId: draftPurchaseOrder.customerId,
    //     code: draftPurchaseOrder.code,
    //     totalAmount: draftPurchaseOrder.totalAmount,
    //     discountAmount: draftPurchaseOrder.discountAmount,
    //     timestamp: new Date().toISOString(),
    //   },
    // );
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
    });

    newDraftPurchaseOrder.addItem(purchaseOrderItem);

    await this.repository.addPurchaseOrder(newDraftPurchaseOrder);

    await this.repository.addPurchaseOrderItem(purchaseOrderItem);

    this.eventQueue.enqueue(new AddDraftPurchaseOrderEvent(
      newDraftPurchaseOrder.id,
      newDraftPurchaseOrder.customerId,
      newDraftPurchaseOrder.totalAmount,
      newDraftPurchaseOrder.discountAmount,
      newDraftPurchaseOrder.createdAt,
      newDraftPurchaseOrder.code,
    )).catch(console.error.bind(console));

    this.eventQueue.enqueue(new AddPurchaseOrderItemEvent(
      purchaseOrderItem.id,
      purchaseOrderItem.purchaseOrderId,
      purchaseOrderItem.quantity,
      purchaseOrderItem.product.id,
      purchaseOrderItem.product.name,
      purchaseOrderItem.product.amount,
    )).catch(console.error.bind(console));
  }
}
