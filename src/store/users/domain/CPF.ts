import IValueObject from '@shared/abstractions/IValueObject';
import Validator from '@shared/utils/Validator';

export default class CPF implements IValueObject {
  public readonly value: string;

  private readonly digits: string;

  constructor(value: string) {
    this.value = value.replace(/\D+/g, '');
    this.digits = this.value.substring(this.value.length - 2);
  }

  public format() {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public isValid() {
    Validator
      .setData({ document: this.value })
      .setRule('value', (value) => this.checkFirstNineNumbers(value) && this.checkFirstTenNumbers(value))
      .validate();
  }

  private checkFirstNineNumbers(value: string) {
    const firstNineNumbers = this.value.substring(0, this.value.length - 2).split('');

    const firstSum = firstNineNumbers.reduce((acc, number, index) => {
      const result = Number(number) * (10 - index);

      return acc + result;
    }, 0);

    let restOfFirstSum = (firstSum * 10) % 11;

    if (restOfFirstSum === 10 || restOfFirstSum === 11) {
      restOfFirstSum = 0;
    }

    const firstDigit = Number(this.digits[0]);

    if (restOfFirstSum !== firstDigit) {
      return false;
    }

    return true;
  }

  private checkFirstTenNumbers(value: string) {
    const firstTenNumbers = this.value.substring(0, this.value.length - 1).split('');

    const secondSum = firstTenNumbers.reduce((acc, number, index) => {
      const result = Number(number) * (11 - index);

      return acc + result;
    }, 0);

    let restOfSecondSum = (secondSum * 10) % 11;

    if (restOfSecondSum === 10 || restOfSecondSum === 11) {
      restOfSecondSum = 0;
    }

    const secondDigit = Number(this.digits[1]);

    if (restOfSecondSum !== secondDigit) {
      return false;
    }

    return true;
  }
}
