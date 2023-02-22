import Command from '@shared/abstractions/Command';
import Validator from '@shared/utils/Validator';

export default class ApplyVoucherCommand extends Command {
  constructor(
    readonly customerId: string,
    readonly voucherCode: number,
  ) {
    super();
    this.validate();
  }

  protected validate(): void {
    Validator.setData(this)
      .setRule('customerId', ['required', 'string', 'uuid'])
      .setRule('voucherCode', ['required', 'number', 'integer'])
      .validate();
  }
}
