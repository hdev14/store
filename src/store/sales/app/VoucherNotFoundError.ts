export default class VoucherNotFoundError extends Error {
  constructor() {
    super('Voucher não encontrado.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, VoucherNotFoundError.prototype);
  }
}
