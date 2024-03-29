import { faker } from '@faker-js/faker';
import ValidationError from '@shared/errors/ValidationError';
import Validator from '@shared/utils/Validator';

describe("Validator's unit tests", () => {
  describe('Strings', () => {
    it('throws a ValidationError if field is not a string', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.float() })
          .setRule('test', ['string'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is required', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: '' })
          .setRule('test', ['string', 'required'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is greater than max length', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.string(6) })
          .setRule('test', ['string', 'max:5'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is less than min length', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.string(3) })
          .setRule('test', ['string', 'min:5'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is not an url', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.word.adjective() })
          .setRule('test', ['string', 'url'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is not an uuid', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.word.verb() })
          .setRule('test', ['string', 'uuid'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is not an email', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.word.verb() })
          .setRule('test', ['string', 'email'])
          .validate();
      }).toThrow(ValidationError);
    });
  });

  describe('Numbers', () => {
    it('throws a ValidationError if field is not a number', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', ['number'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is required', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: undefined })
          .setRule('test', ['required', 'number'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is not a integer', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: 1.5 })
          .setRule('test', ['number', 'integer'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is not a float', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: parseInt(faker.datatype.number().toString(), 10) })
          .setRule('test', ['number', 'float'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is greater than max value', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.datatype.number({ min: 11 }) })
          .setRule('test', ['number', 'max:10'])
          .validate();
      }).toThrow(ValidationError);
    });

    it('throws a ValidationError if field is less than min value', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: Math.random() * 10 * -1 })
          .setRule('test', ['number', 'min:10'])
          .validate();
      }).toThrow(ValidationError);
    });
  });

  describe('Booleans', () => {
    it('throws a ValidationError if field is not a boolean', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', ['boolean'])
          .validate();
      }).toThrow(ValidationError);
    });
  });

  describe('Dates', () => {
    it('throws a ValidationError if field is not a date', () => {
      expect.assertions(1);
      expect(() => {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', ['date'])
          .validate();
      }).toThrow(ValidationError);
    });
  });

  describe('Custom', () => {
    it('calls the custom function validator', () => {
      const customValidationFunction = jest.fn().mockReturnValue(true);

      const test = faker.datatype.string();

      Validator
        .setData({ test })
        .setRule('test', customValidationFunction)
        .validate();

      expect(customValidationFunction).toHaveBeenCalledWith(test);
    });

    it('throws a ValidationError if custom function validator returns FALSE', () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', () => false)
          .validate();
      }).toThrow(ValidationError);
    });

    it("doesn't throws a ValidationError if custom function validator returns TRUE", () => {
      expect.assertions(1);

      expect(() => {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', () => true)
          .validate();
      }).not.toThrowError(ValidationError);
    });
  });
});
