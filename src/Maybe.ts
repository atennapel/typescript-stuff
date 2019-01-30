export default abstract class Maybe<T> {

  static nothing<T>() { return new Nothing<T>() }
  static just<T>(val: T) { return new Just<T>(val) }
  static of<T>(val: T | null | undefined): Maybe<T> {
    return typeof val === 'undefined' || val === null ?
      Maybe.nothing<T>() : Maybe.just(val);
  }

  abstract toString(): string;

  abstract map<R>(fn: (val: T) => R): Maybe<R>;
  abstract map2<T2, R>(fn: (val: T, val2: T2) => R, other: Maybe<T2>): Maybe<R>;
  abstract chain<R>(fn: (val: T) => Maybe<R>): Maybe<R>;

  abstract or<T2>(other: Maybe<T2>): Maybe<T | T2>;

}

export class Nothing<T> extends Maybe<T> {

  constructor() { super() }

  toString() { return `Nothing` }

  map<R>(fn: (val: T) => R): Maybe<R> {
    return this as any as Maybe<R>;
  }
  map2<T2, R>(fn: (val: T, val2: T2) => R, other: Maybe<T2>): Maybe<R> {
    return this as any as Maybe<R>;
  }
  chain<R>(fn: (val: T) => Maybe<R>): Maybe<R> {
    return this as any as Maybe<R>;
  }

  or<T2>(other: Maybe<T2>): Maybe<T | T2> {
    return other;
  }

}

export class Just<T> extends Maybe<T> {

  constructor(public readonly value: T) { super() }

  toString() { return `Just(${this.value})` }

  map<R>(fn: (val: T) => R): Maybe<R> {
    return new Just(fn(this.value));
  }
  map2<T2, R>(fn: (val: T, val2: T2) => R, other: Maybe<T2>): Maybe<R> {
    return other instanceof Nothing ?
      other as any as Maybe<R> :
      new Just(fn(this.value, (other as any).value));
  }
  chain<R>(fn: (val: T) => Maybe<R>): Maybe<R> {
    return fn(this.value);
  }

  or<T2>(other: Maybe<T2>): Maybe<T | T2> {
    return this;
  }

}
