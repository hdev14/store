import Operation from './Operation';

export default abstract class Command<Result, Data> extends Operation<Result | void, Data> {}
