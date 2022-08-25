import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';

export type AddPurchaseItemData = {
  clientId: string;
  productId: string;
  productName: string;
  productAmount: number;
  quantity: number;
}

export default class AddPurchaseItemCommand extends Command<boolean, AddPurchaseItemData> {
  public send(data: EventData<AddPurchaseItemData>): Promise<boolean | void> {
    console.info(data);
    return Promise.resolve(true);
  }

  public validate(data: EventData<AddPurchaseItemData>): boolean {
    console.info(data);
    throw new Error('Method not implemented.');
  }
}
