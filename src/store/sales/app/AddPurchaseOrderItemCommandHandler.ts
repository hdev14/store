import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import IGenerateID from '@shared/utils/IGenerateID';
import { AddPurchaseOrderItemData } from './AddPurchaseOrderItemCommand';

export default class AddPurchaseOrderItemCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  private generateID: IGenerateID;

  constructor(repository: IPurchaseOrderRepository, generateID: IGenerateID) {
    this.repository = repository;
    this.generateID = generateID;
  }

  public async handle(data: EventData<AddPurchaseOrderItemData>): Promise<void | boolean> {
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
      return false;
    }
  }

  private async updatePurchaseOrder(
    draftPurchaseOrder: PurchaseOrder,
    purchaseOrderItem: PurchaseOrderItem,
  ): Promise<void> {
    const exists = draftPurchaseOrder.hasItem(purchaseOrderItem);
    draftPurchaseOrder.addItem(purchaseOrderItem);
    console.info(draftPurchaseOrder.items);

    if (exists) {
      const addedPurchaseOrderItem = draftPurchaseOrder.items.find(
        (i) => i.product.id === purchaseOrderItem.product.id,
      )!;

      await this.repository.updatePurchaseOrderItem(addedPurchaseOrderItem);
    } else {
      await this.repository.addPurchaseOrderItem(purchaseOrderItem);
    }

    await this.repository.updatePurchaseOrder(draftPurchaseOrder);
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
  }
}
