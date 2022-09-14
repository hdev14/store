import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import EventPublisher from '@shared/EventPublisher';
import IGenerateID from '@shared/utils/IGenerateID';
import AddDraftPurchaseOrderEvent, { AddDraftPurchaseOrderEventData } from './AddDraftPurchaseOrderEvent';
import { AddPurchaseOrderItemData } from './AddPurchaseOrderItemCommand';
import AddPurchaseOrderItemEvent, { AddPurchaseOrderItemEventData } from './AddPurchaseOrderItemEvent';
import UpdateDraftPurchaseOrderEvent, { UpdateDraftPurchaseOrderEventData } from './UpdateDraftPurchaseOrderEvent';
import UpdatePurchaseOrderItemEvent, { UpdatePurchaserOrderItemEventData } from './UpdatePurchaseOrderItemEvent';

export default class AddPurchaseOrderItemCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  private generateID: IGenerateID;

  private eventPublisher: EventPublisher;

  constructor(
    repository: IPurchaseOrderRepository,
    generateID: IGenerateID,
    eventPublisher: EventPublisher,
  ) {
    this.repository = repository;
    this.generateID = generateID;
    this.eventPublisher = eventPublisher;
  }

  public async handle(data: EventData<AddPurchaseOrderItemData>): Promise<boolean> {
    let hasExpection = false;

    try {
      const purchaseOrderItem = new PurchaseOrderItem({
        id: data.principalId,
        product: new Product(
          data.productId,
          data.productName,
          data.productAmount,
        ),
        quantity: data.quantity,
      });

      const draftPurchaseOrder = await this.repository
        .getDraftPurchaseOrderByClientId(data.clientId);

      if (!draftPurchaseOrder) {
        await this.createNewDraftPurcahseOrder(data.clientId, purchaseOrderItem);
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
        purchaseOrderItemId: purchaseOrderItem.id,
        purchaseOrderQuantity: purchaseOrderItem.quantity,
        productId: purchaseOrderItem.product.id,
        timestamp: new Date().toISOString(),
      },
    );
  }

  private async createNewDraftPurcahseOrder(
    clientId: string,
    purchaseOrderItem: PurchaseOrderItem,
  ): Promise<void> {
    const code = await this.repository.countPurchaseOrders() + 1;

    const newDraftPurchaseOrder = PurchaseOrder.createDraft({
      id: this.generateID(),
      clientId,
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
        purchaseOrderItemId: purchaseOrderItem.id,
        timestamp: new Date().toISOString(),
      },
    );

    this.eventPublisher.addEvent<AddPurchaseOrderItemEventData>(
      AddPurchaseOrderItemEvent,
      {
        principalId: purchaseOrderItem.id,
        productId: purchaseOrderItem.product.id,
        productName: purchaseOrderItem.product.name,
        productAmount: purchaseOrderItem.product.amount,
        quantity: purchaseOrderItem.quantity,
        timestamp: new Date().toISOString(),
      },
    );
  }
}
