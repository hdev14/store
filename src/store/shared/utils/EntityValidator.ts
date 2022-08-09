import ValidationEntityError, { GenericError } from '../errors/ValidationEntityError';

// eslint-disable-next-line no-useless-escape
const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

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
};

const RULE_MESSAGES = {
  required: (field: string) => `The field ${field} must be a string`,
  max: (field: string, max: number) => `The field ${field} must be less than ${max}.`,
  min: (field: string, min: number) => `The field ${field} must be greater than ${min}.`,
  url: (field: string) => `The field ${field} must be an URL.`,
};

export default class EntityValidator {
  private data: any;

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

  validate() {
    this.rules.forEach((fieldRules, fieldName) => {
      const field = this.data[fieldName];
      const messages: string[] = [];

      fieldRules.forEach((fr) => {
        const [name, value] = fr.split(':');
        const params = [field, value];

        // @ts-ignore
        if (RULE_FUNCTIONS[name](...params)) {
          // @ts-ignore
          messages.push(RULE_MESSAGES[name](fieldName, value));
        }
      });

      if (messages.length > 0) {
        this.addError({ field: fieldName, messages });
      }
    });

    if (this.errors.length > 0) {
      throw new ValidationEntityError(this.errors);
    }
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