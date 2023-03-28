/* eslint-disable @typescript-eslint/ban-ts-comment */
import ValidationError, { GenericError } from '../errors/ValidationError';

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/;

const RULE_FUNCTIONS = {
  required: (value: any) => {
    switch (typeof value) {
      case 'number':
        return (value === undefined || value === null);
      case 'string':
        return (value === undefined || value === null || value.length === 0);
      case 'object':
        // don't use it with Date.
        return (
          value === undefined
          || value === null
          || Object.keys(value).length === 0
        );
      default:
        return true;
    }
  },
  max: (value: any, max: number) => {
    if (value !== undefined) {
      switch (typeof value) {
        case 'number':
          return value > max;
        case 'string':
          return value.length > max;
        default:
          return true;
      }
    }
    return false;
  },
  min: (value: any, min: number) => {
    if (value !== undefined) {
      switch (typeof value) {
        case 'number':
          return value < min;
        case 'string':
          return value.length < min;
        default:
          return true;
      }
    }

    return false;
  },
  url: (value: any) => (value !== undefined && typeof value === 'string' && !URL_REGEX.test(value)),
  string: (value: any) => (value !== undefined && typeof value !== 'string'),
  number: (value: any) => (value !== undefined && typeof value !== 'number'),
  integer: (value: any) => (value !== undefined && typeof value === 'number' && !Number.isInteger(value)),
  float: (value: any) => (value !== undefined && typeof value === 'number' && Number.isInteger(value)),
  uuid: (value: any) => (value !== undefined && typeof value === 'string' && !UUID_REGEX.test(value)),
  date: (value: any) => (value !== undefined && !(value instanceof Date)),
  boolean: (value: any) => (value !== undefined && typeof value !== 'boolean'),
  email: (value: any) => (value !== undefined && typeof value === 'string' && !EMAIL_REGEX.test(value)),
};

const RULE_MESSAGES = {
  required: (field: string) => `The field ${field} is required.`,
  max: (field: string, max: number, isString: boolean) => {
    if (isString) {
      return `The text must have less or equal to ${max} caracters.`;
    }
    return `The field ${field} must be less than or equal to ${max}.`;
  },
  min: (field: string, min: number, isString: boolean) => {
    if (isString) {
      return `The text must have more or equal to ${min} caracters.`;
    }

    return `The field ${field} must be greater than or equal to ${min}.`;
  },
  url: (field: string) => `The field ${field} must be an URL.`,
  string: (field: string) => `The field ${field} must be a text.`,
  number: (field: string) => `The field ${field} must be a number.`,
  integer: (field: string) => `The field ${field} must be an integer.`,
  float: (field: string) => `The field ${field} must be a float.`,
  uuid: (field: string) => `The field ${field} must be an UUID.`,
  date: (field: string) => `The field ${field} must be a validate date.`,
  boolean: (field: string) => `The field ${field} must be a boolean.`,
  email: (field: string) => `The field ${field} must be a valid email address.`,
};

type FunctionValidator = (value: any) => boolean;

export default class Validator {
  private data: Record<string, unknown>;

  private ruleMap: Map<string, string[] | FunctionValidator> = new Map<string, string[] | FunctionValidator>();

  private errors: GenericError[] = [];

  constructor(data: any) {
    this.data = data;
  }

  public static setData(data: any) {
    return new Validator(data);
  }

  public setRule(field: string, rule: string[] | FunctionValidator) {
    this.ruleMap.set(field, rule);
    return this;
  }

  public validate(doNotThrows = false) {
    const entries = this.ruleMap.entries();

    for (const [fieldName, rule] of entries) {
      const field = this.data[fieldName];
      const messages: string[] = [];

      if (typeof rule === 'function') {
        if (!rule(field)) {
          messages.push(`The field ${fieldName} is not valid.`);
        }
      } else {
        messages.push(...this.validateByArray(rule, field, fieldName));
      }

      if (messages.length > 0) {
        this.addError({ field: fieldName, messages });
      }
    }

    const hasErrors = this.errors.length > 0;

    if (hasErrors && !doNotThrows) {
      throw new ValidationError(this.errors);
    }

    return this.errors;
  }

  private validateByArray(rule: string[], field: unknown, fieldName: string) {
    const messages: string[] = [];

    for (let i = 0, len = rule.length; i < len; i += 1) {
      const ruleString = rule[i];
      const [name, value] = ruleString.split(':');

      // @ts-ignore
      const isNotValid = RULE_FUNCTIONS[name](field, value);

      if (isNotValid) {
        // @ts-ignore
        const message = RULE_MESSAGES[name](fieldName, value, typeof field === 'string');

        messages.push(message);
      }
    }

    return messages;
  }

  private addError(error: GenericError) {
    const index = this.errors.findIndex((e) => e.field === error.field);

    if (index !== -1) {
      this.errors[index].messages = [...this.errors[index].messages, ...error.messages];
      return;
    }

    this.errors.push(error);
  }
}
