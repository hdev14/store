import { faker } from '@faker-js/faker';
import ValidationError from '@shared/errors/ValidationError';
import Validator from '@shared/utils/Validator';

describe("Validator's unit tests", () => {
  describe('Strings', () => {
    it('throws a ValidationError if field is not a string', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.float() })
          .setRule('test', ['string'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be a text.');
      }
    });

    it('throws a ValidationError if field is required', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: '' })
          .setRule('test', ['string', 'required'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test is required.');
      }
    });

    it('throws a ValidationError if field is greater than max length', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.string(6) })
          .setRule('test', ['string', 'max:5'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The text must have less or equal to 5 caracters.');
      }
    });

    it('throws a ValidationError if field is less than min length', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.string(3) })
          .setRule('test', ['string', 'min:5'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The text must have more or equal to 5 caracters.');
      }
    });

    it('throws a ValidationError if field is not a url', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.word.adjective() })
          .setRule('test', ['string', 'url'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be an URL.');
      }
    });

    it('throws a ValidationError if field is not a uuid', () => {
      expect.assertions(3);

      try {
        Validator
          .setData({ test: faker.word.verb() })
          .setRule('test', ['string', 'uuid'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be an UUID.');
      }
    });
  });

  describe('Numbers', () => {
    it('throws a ValidationError if field is not a number', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', ['number'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be a number.');
      }
    });

    it('throws a ValidationError if field is required', () => {
      expect.assertions(4);
      try {
        Validator
          .setData({ test: undefined })
          .setRule('test', ['required', 'number'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test is required.');
        expect(e.errors[0].messages[1]).toEqual('The field test must be a number.');
      }
    });

    it('throws a ValidationError if field is not a integer', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.float() })
          .setRule('test', ['number', 'integer'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be an integer.');
      }
    });

    it('throws a ValidationError if field is not a float', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: parseInt(faker.datatype.number().toString(), 10) })
          .setRule('test', ['number', 'float'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be a float.');
      }
    });

    it('throws a ValidationError if field is greater than max value', () => {
      expect.assertions(3);

      try {
        Validator
          .setData({ test: faker.datatype.number({ min: 11 }) })
          .setRule('test', ['number', 'max:10'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be less than or equal to 10.');
      }
    });

    it('throws a ValidationError if field is less than min value', () => {
      expect.assertions(3);

      try {
        Validator
          .setData({ test: Math.random() * 10 * -1 })
          .setRule('test', ['number', 'min:10'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be greater than or equal to 10.');
      }
    });
  });

  describe('Booleans', () => {
    it('throws a ValidationError if field is not a boolean', () => {
      expect.assertions(3);
      try {
        Validator
          .setData({ test: faker.datatype.string() })
          .setRule('test', ['boolean'])
          .validate();
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationError);
        expect(e.errors[0].field).toEqual('test');
        expect(e.errors[0].messages[0]).toEqual('The field test must be a boolean.');
      }
    });
  });
});
