import Event from './Event';

export default abstract class Query<T> extends Event<void, T> { }
