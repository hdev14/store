import { GenericError } from '../errors/ValidationEntityError';

const ruleFunctions = {
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
          || Object.keys(value).length > 0
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
  min: (value: any, max: number) => {
    switch (typeof value) {
      case 'number':
        return value < max;
      case 'string':
        return value.length < max;
      default:
        return true;
    }
  },
};

const ruleMessages = {
  required: (field: string) => `The field ${field} must be a string`,
  max: (field: string, max: number) => `The field ${field} must be less than ${max}.`,
  min: (field: string, min: number) => `The field ${field} must be greater than ${min}.`,
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
    this.rules.forEach((rule) => {
      const fieldName = rule[0];
      const fieldRules = rule[1].split('|');

      const field = this.data[fieldName];
      const messages: string[] = [];

      fieldRules.forEach((fr) => {
        const [name, value] = fr.split(':');
        const params = [field, value];

        // @ts-ignore
        if (ruleFunctions[name](...params)) {
          // @ts-ignore
          messages.push(ruleMessages[name](fieldName, value));
        }
      });

      if (messages.length > 0) {
        this.addError({ field: fieldName, messages });
      }
    });
  }

  public hasErrors() {
    return this.errors.length > 0;
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
