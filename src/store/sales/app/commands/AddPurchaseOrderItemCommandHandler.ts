import crypto from 'crypto';
import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import EventPublisher from '@shared/EventPublisher';
import IHandler from '@shared/abstractions/IHandler';
import AddDraftPurchaseOrderEvent, { AddDraftPurchaseOrderEventData } from '../events/AddDraftPurchaseOrderEvent';
import { AddPurchaseOrderItemCommandData } from './AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemEvent, { AddPurchaseOrderItemEventData } from '../events/AddPurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent, { UpdateDraftPurchaseOrderEventData } from '../events/UpdateDraftPurchaseOrderEvent';
import UpdatePurchaseOrderItemEvent, { UpdatePurchaserOrderItemEventData } from '../events/UpdatePurchaseOrderItemEvent';

// eslint-disable-next-line max-len
export default class AddPurchaseOrderItemCommandHandler implements IHandler<boolean, AddPurchaseOrderItemCommandData> {
  constructor(
    private readonly repository: IPurchaseOrderRepository,
    private readonly eventPublisher: EventPublisher,
  ) {
    this.repository = repository;
    this.eventPublisher = eventPublisher;
  }

  public async handle(data: AddPurchaseOrderItemCommandData): Promise<boolean> {
    let hasExpection = false;

    try {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: crypto.randomUUID(),
        product: new Product(
          data.productId,
          data.productName,
          data.productAmount,
        ),
        quantity: data.quantity,
      });

      const draftPurchaseOrder = await this.repository
        .getDraftPurchaseOrderByCustomerId(data.customerId);

      if (!draftPurchaseOrder) {
        await this.createNewDraftPurcahseOrder(data.customerId, purchaseOrderItem);
        return true;
      }

      await this.updatePurchaseOrder(draftPurchaseOrder, purchaseOrderItem);

      return true;
    } catch (e: any) {
      console.error(e.stack);

      hasExpection = true;

      return false;
    } finally {
      if (!hasExpection) {
        await this.eventPublisher.sendEvents();
      }
    }
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

      this.eventPublisher.addEvent<UpdatePurchaserOrderItemEventData>(
        UpdatePurchaseOrderItemEvent,
        {
          principalId: addedPurchaseOrderItem.id,
          productId: addedPurchaseOrderItem.product.id,
          productName: addedPurchaseOrderItem.product.name,
          productAmount: addedPurchaseOrderItem.product.amount,
          quantity: addedPurchaseOrderItem.quantity,
          timestamp: new Date().toISOString(),
        },
      );
    } else {
      await this.repository.addPurchaseOrderItem(purchaseOrderItem);

      this.eventPublisher.addEvent<AddPurchaseOrderItemEventData>(
        AddPurchaseOrderItemEvent,
        {
          principalId: purchaseOrderItem.id,
          productId: purchaseOrderItem.product.id,
          productName: purchaseOrderItem.product.name,
          productAmount: purchaseOrderItem.product.amount,
          purchaseOrderId: purchaseOrderItem.purchaseOrderId,
          quantity: purchaseOrderItem.quantity,
          timestamp: new Date().toISOString(),
        },
      );
    }

    await this.repository.updatePurchaseOrder(draftPurchaseOrder);

    this.eventPublisher.addEvent<UpdateDraftPurchaseOrderEventData>(
      UpdateDraftPurchaseOrderEvent,
      {
        principalId: draftPurchaseOrder.id,
        customerId: draftPurchaseOrder.customerId,
        code: draftPurchaseOrder.code,
        totalAmount: draftPurchaseOrder.totalAmount,
        discountAmount: draftPurchaseOrder.discountAmount,
        timestamp: new Date().toISOString(),
      },
    );
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

    this.eventPublisher.addEvent<AddDraftPurchaseOrderEventData>(
      AddDraftPurchaseOrderEvent,
      {
        principalId: newDraftPurchaseOrder.id,
        customerId: newDraftPurchaseOrder.customerId,
        code: newDraftPurchaseOrder.code,
        totalAmount: newDraftPurchaseOrder.totalAmount,
        discountAmount: newDraftPurchaseOrder.discountAmount,
        createdAt: newDraftPurchaseOrder.createdAt,
        timestamp: new Date().toISOString(),
      },
    );

    this.eventPublisher.addEvent<AddPurchaseOrderItemEventData>(
      AddPurchaseOrderItemEvent,
      {
        principalId: purchaseOrderItem.id,
        purchaseOrderId: purchaseOrderItem.purchaseOrderId,
        quantity: purchaseOrderItem.quantity,
        productId: purchaseOrderItem.product.id,
        productName: purchaseOrderItem.product.name,
        productAmount: purchaseOrderItem.product.amount,
        timestamp: new Date().toISOString(),
      },
    );
  }
}
