import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import AddDraftPurchaseOrderEvent from '@sales/domain/events/AddDraftPurchaseOrderEvent';
import AddPurchaseOrderItemEvent from '@sales/domain/events/AddPurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent from '@sales/domain/events/UpdateDraftPurchaseOrderEvent';
import UpdatePurchaseOrderItemEvent from '@sales/domain/events/UpdatePurchaseOrderItemEvent';
import IEventQueue from '@shared/abstractions/IEventQueue';
import IHandler from '@shared/abstractions/IHandler';
import crypto from 'crypto';
import AddPurchaseOrderItemCommand from '../commands/AddPurchaseOrderItemCommand';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommandHandler implements IHandler<AddPurchaseOrderItemCommand, void> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly event_queue: IEventQueue,
  ) { }

  public async handle(event: AddPurchaseOrderItemCommand): Promise<void> {
    const purchase_order_item = new PurchaseOrderItem({
      id: crypto.randomUUID(),
      product: {
        id: event.product_id,
        name: event.product_name,
        amount: event.product_amount,
      },
      quantity: event.quantity,
    });

    const draft_purchase_order = await this.repository
      .getDraftPurchaseOrderByCustomerId(event.customer_id);

    if (!draft_purchase_order) {
      await this.createNewDraftPurcahseOrder(event.customer_id, purchase_order_item);
      return;
    }

    await this.updatePurchaseOrder(draft_purchase_order, purchase_order_item);
  }

  private async updatePurchaseOrder(
    draft_purchase_order: PurchaseOrder,
    purchase_order_item: PurchaseOrderItem,
  ): Promise<void> {
    const exists = draft_purchase_order.hasItem(purchase_order_item);
    draft_purchase_order.addItem(purchase_order_item);

    if (exists) {
      const added_purchase_order_item = draft_purchase_order.items.find(
        (i) => i.product.id === purchase_order_item.product.id,
      )!;

      await this.repository.updatePurchaseOrderItem(added_purchase_order_item);

      this.event_queue.enqueue(new UpdatePurchaseOrderItemEvent(
        added_purchase_order_item.id,
        added_purchase_order_item.quantity,
        added_purchase_order_item.product.id,
        added_purchase_order_item.product.name,
        added_purchase_order_item.product.amount,
      )).catch(console.error.bind(console));
    } else {
      await this.repository.addPurchaseOrderItem(purchase_order_item);

      this.event_queue.enqueue(new AddPurchaseOrderItemEvent(
        purchase_order_item.id,
        purchase_order_item.purchase_order_id,
        purchase_order_item.quantity,
        purchase_order_item.product.id,
        purchase_order_item.product.name,
        purchase_order_item.product.amount,
      )).catch(console.error.bind(console));
    }

    await this.repository.updatePurchaseOrder(draft_purchase_order);

    this.event_queue.enqueue(new UpdateDraftPurchaseOrderEvent(
      draft_purchase_order.id,
      draft_purchase_order.customer_id,
      draft_purchase_order.code,
      draft_purchase_order.total_amount,
      draft_purchase_order.discount_amount,
    )).catch(console.error.bind(console));
  }

  private async createNewDraftPurcahseOrder(
    customer_id: string,
    purchase_order_item: PurchaseOrderItem,
  ): Promise<void> {
    const code = await this.repository.countPurchaseOrders() + 1;

    const new_draft_purchase_order = PurchaseOrder.createDraft({
      id: crypto.randomUUID(),
      customer_id,
      created_at: new Date(),
      code,
      voucher: null,
      status: null,
      items: [],
    });

    new_draft_purchase_order.addItem(purchase_order_item);

    await this.repository.addPurchaseOrder(new_draft_purchase_order);

    await this.repository.addPurchaseOrderItem(purchase_order_item);

    this.event_queue.enqueueInBatch([
      new AddDraftPurchaseOrderEvent(
        new_draft_purchase_order.id,
        new_draft_purchase_order.customer_id,
        new_draft_purchase_order.total_amount,
        new_draft_purchase_order.discount_amount,
        new_draft_purchase_order.created_at,
        new_draft_purchase_order.code,
      ),
      new AddPurchaseOrderItemEvent(
        purchase_order_item.id,
        purchase_order_item.purchase_order_id,
        purchase_order_item.quantity,
        purchase_order_item.product.id,
        purchase_order_item.product.name,
        purchase_order_item.product.amount,
      ),
    ]).catch(console.error.bind(console));
  }
}
