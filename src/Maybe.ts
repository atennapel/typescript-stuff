export default abstract class Maybe<T> {

  static nothing<T>() { return new Nothing<T>() }
  static just<T>(val: T) { return new Just<T>(val) }
  static of<T>(val: T | null | undefined): Maybe<T> {
    return typeof val === 'undefined' || val === null ?
      Maybe.nothing<T>() : Maybe.just(val);
  }

  abstract toString(): string;

  abstract map<R>(fn: (val: T) => R): Maybe<R>;

}

export class Nothing<T> extends Maybe<T> {

  constructor() { super() }

  toString() { return `Nothing` }

  map<R>(fn: (val: T) => R): Maybe<R> {
    return this as any as Maybe<R>;
  }

}

export class Just<T> extends Maybe<T> {

  constructor(public readonly value: T) { super() }

  toString() { return `Just(${this.value})` }

  map<R>(fn: (val: T) => R): Maybe<R> {
    return new Just(fn(this.value));
  }

}
