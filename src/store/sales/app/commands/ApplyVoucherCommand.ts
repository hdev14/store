import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export type ApplyVoucherCommandData = {
  customerId: string;
  voucherCode: number;
}

export default class ApplyVoucherCommand extends Command<boolean, ApplyVoucherCommandData> {
  public validate(data: ApplyVoucherCommandData): boolean | void {
    Validator.setData(data)
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('voucherCode', ['required', 'number', 'integer'])
      .validate();
  }
}
