export default class EntityValidator {
  private _data: any;

  private _rules: Map<string, string[]> = new Map<string, string[]>();

  constructor(data: any) {
    this._data = data;
  }

  static setData(data: any) {
    return new EntityValidator(data);
  }

  setRule(field: string, rules: string[]) {
    this._rules.set(field, rules);
  }

  validate() {
    return !!this;
  }
}
