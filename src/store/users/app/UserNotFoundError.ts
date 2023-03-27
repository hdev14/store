export default class UserNotFoundError extends Error {
  constructor() {
    super('Usuário não encontrado.');
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
