import ValidationError from '@shared/errors/ValidationError';
import CPF from '@users/domain/CPF';

describe("CPF's unit tests", () => {
  it('formats the value', () => {
    const cpf = new CPF('99242742023');

    expect(cpf.format()).toEqual('992.427.420-23');
  });

  it('validates the value', () => {
    const cpf = new CPF('99242742223');

    try {
      cpf.isValid();
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
  });
});
