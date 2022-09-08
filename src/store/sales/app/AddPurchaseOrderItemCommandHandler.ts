import IPurchaseOrderRepository from '@sales/domain/IPurchaseOrderRepository';
import Product from '@sales/domain/Product';
import PurchaseOrder from '@sales/domain/PurchaseOrder';
import PurchaseOrderItem from '@sales/domain/PurchaseOrderItem';
import { EventData, IEventHandler } from '@shared/@types/events';
import IGenerateID from '@shared/utils/IGenerateID';
import { AddPurchaseOrderItemData } from './AddPurchaseOrderItemCommand';

export default class AddPurchaseItemCommandHandler implements IEventHandler<boolean> {
  private repository: IPurchaseOrderRepository;

  private generateID: IGenerateID;

  constructor(repository: IPurchaseOrderRepository, generateID: IGenerateID) {
    this.repository = repository;
    this.generateID = generateID;
  }

  public async handle(data: EventData<AddPurchaseOrderItemData>): Promise<void | boolean> {
    // TODO:
    // Add try/catch to return FALSE if something goes wrong
    // Create a function to perform each individual logic
    const draftPurchaseOrder = await this.repository.getDraftPurchaseOrderByClientId(data.clientId);

    const purchaseOrderItem = new PurchaseOrderItem({
      id: data.principalId,
      product: new Product(data.productId, data.productName, data.productAmount),
      quantity: data.quantity,
    });

    if (!draftPurchaseOrder) {
      const code = await this.repository.countPurchaseOrders() + 1;

      const newDraftPurchaseOrder = PurchaseOrder.createDraft({
        id: this.generateID(),
        clientId: data.clientId,
        createdAt: new Date(),
        code,
        voucher: null,
        status: null,
      });

      newDraftPurchaseOrder.addItem(purchaseOrderItem);

      return true;
    }

    // const exists = draftPurchaseOrder.hasItem(purchaseOrderItem);
    // draftPurchaseOrder.addItem(purchaseOrderItem);

    // if (exists) {
    //   await this.repository.updatePurchaseOrderItem(
    //     draftPurchaseOrder.items.find((i) => i.product.id === purchaseOrderItem.product.id)!,
    //   );

    //   return true;
    // }

    // await this.repository.addPurchaseOrderItem(purchaseOrderItem);

    return true;
  }
}
