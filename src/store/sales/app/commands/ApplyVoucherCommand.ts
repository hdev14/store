import { EventData } from '@shared/@types/events';
import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type ApplyVoucherCommandData = {
  customerId: string;
  voucherCode: number;
}

export default class ApplyVoucherCommand extends Command<boolean, ApplyVoucherCommandData> {
  public send(data: EventData<ApplyVoucherCommandData>): Promise<boolean | void> {
    this.validate(data);

    return this.mediator.send(this.constructor.name, data);
  }

  public validate(data: EventData<ApplyVoucherCommandData>): boolean | void {
    Validator.setData(data)
      .setRule('principalId', ['required', 'string', 'uuid'])
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('voucherCode', ['required', 'number', 'integer'])
      .validate();
  }
}
