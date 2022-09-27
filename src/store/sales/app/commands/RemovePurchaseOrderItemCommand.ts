import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class RemovePurchaseOrderItemCommand extends Command<boolean, {}> {
  public send(data: EventData): Promise<boolean | void> {
    this.validate(data);

    return this.mediator.send(this.constructor.name, data);
  }

  public validate(data: EventData): void {
    Validator.setData(data)
      .setRule('principalId', ['required', 'string', 'uuid'])
      .validate();
  }
}
