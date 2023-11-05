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
    const first_nine_numbers = this.value.substring(0, this.value.length - 2).split('');

    let first_sum = 0;

    for (let index = 0, len = first_nine_numbers.length; index < len; index += 1) {
      const number = first_nine_numbers[index];
      const result = Number(number) * (10 - index);
      first_sum += result;
    }

    let rest_of_first_sum = (first_sum * 10) % 11;

    if (rest_of_first_sum === 10 || rest_of_first_sum === 11) {
      rest_of_first_sum = 0;
    }

    const first_digit = Number(this.digits[0]);

    if (rest_of_first_sum !== first_digit) {
      return false;
    }

    return true;
  }

  private checkFirstTenNumbers() {
    const first_ten_numbers = this.value.substring(0, this.value.length - 1).split('');

    let second_sum = 0;

    for (let index = 0, len = first_ten_numbers.length; index < len; index += 1) {
      const number = first_ten_numbers[index];
      const result = Number(number) * (10 - index);
      second_sum += result;
    }

    let rest_of_second_sum = (second_sum * 10) % 11;

    if (rest_of_second_sum === 10 || rest_of_second_sum === 11) {
      rest_of_second_sum = 0;
    }

    const second_digit = Number(this.digits[1]);

    if (rest_of_second_sum !== second_digit) {
      return false;
    }

    return true;
  }
}
