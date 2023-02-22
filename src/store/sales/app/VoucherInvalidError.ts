export default class VoucherInvalidError extends Error {
  constructor() {
    super('Este voucher não é válido.');
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, VoucherInvalidError.prototype);
  }
}
