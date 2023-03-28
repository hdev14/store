import IValueObject from '@shared/abstractions/IValueObject';

export default class CPF implements IValueObject {
  public readonly value: string;

  private readonly digits: string;

  constructor(value: string) {
    this.value = value.toString().replace(/\D+/g, '');
    this.digits = this.value.substring(this.value.length - 2);
  }

  public format() {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  public isValid() {
    return this.checkFirstNineNumbers() && this.checkFirstTenNumbers();
  }

  private checkFirstNineNumbers() {
    const firstNineNumbers = this.value.substring(0, this.value.length - 2).split('');

    let firstSum = 0;

    for (let index = 0, len = firstNineNumbers.length; index < len; index += 1) {
      const number = firstNineNumbers[index];
      const result = Number(number) * (10 - index);
      firstSum += result;
    }

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

  private checkFirstTenNumbers() {
    const firstTenNumbers = this.value.substring(0, this.value.length - 1).split('');

    let secondSum = 0;

    for (let index = 0, len = firstTenNumbers.length; index < len; index += 1) {
      const number = firstTenNumbers[index];
      const result = Number(number) * (10 - index);
      secondSum += result;
    }

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
