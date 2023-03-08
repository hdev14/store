import IValueObject from '@shared/abstractions/IValueObject';

// TODO: add validation and logic to format the value.
export default class CPF implements IValueObject {
  constructor(readonly value: string) {}

  public format() {
    throw new Error('Not implemented yet');
  }

  public isValid() {
    throw new Error('Not implemented yet');
  }
}
