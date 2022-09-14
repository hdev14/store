import ValidationError, { GenericError } from '../errors/ValidationError';

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const RULE_FUNCTIONS = {
  required: (value: any) => {
    switch (typeof value) {
      case 'number':
        return (value === undefined || value === null);
      case 'string':
        return (value === undefined || value === null || value.length === 0);
      case 'object':
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
    switch (typeof value) {
      case 'number':
        return value > max;
      case 'string':
        return value.length > max;
      default:
        return true;
    }
  },
  min: (value: any, min: number) => {
    switch (typeof value) {
      case 'number':
        return value < min;
      case 'string':
        return value.length < min;
      default:
        return true;
    }
  },
  url: (value: any) => (typeof value === 'string' && !URL_REGEX.test(value)),
  string: (value: any) => typeof value !== 'string',
  number: (value: any) => typeof value !== 'number',
  integer: (value: any) => typeof value === 'number' && !Number.isInteger(value),
  float: (value: any) => typeof value === 'number' && Number.isInteger(value),
  uuid: (value: any) => typeof value === 'string' && !UUID_REGEX.test(value),
  date: (value: any) => String(new Date(value)) !== 'Invalid Date',
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
};

export default class EntityValidator {
  private data: Record<string, unknown>;

  private rules: Map<string, string[]> = new Map<string, string[]>();

  private errors: GenericError[] = [];

  constructor(data: any) {
    this.data = data;
  }

  static setData(data: any) {
    return new EntityValidator(data);
  }

  setRule(field: string, rules: string[]) {
    this.rules.set(field, rules);
    return this;
  }

  validate(doNotThrows: boolean = false) {
    this.rules.forEach((fieldRules, fieldName) => {
      const field = this.data[fieldName];
      const messages: string[] = [];

      fieldRules.forEach((fr) => {
        const [name, value] = fr.split(':');
        const params = [field, value];

        // @ts-ignore
        if (RULE_FUNCTIONS[name](...params)) {
          // @ts-ignore
          messages.push(RULE_MESSAGES[name](fieldName, value, typeof field === 'string'));
        }
      });

      if (messages.length > 0) {
        this.addError({ field: fieldName, messages });
      }
    });

    const hasErrors = this.errors.length > 0;

    if (hasErrors && !doNotThrows) {
      throw new ValidationError(this.errors);
    }

    return this.errors;
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
