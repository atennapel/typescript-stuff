export default abstract class List<T> {

  abstract toString(): string;

  static nil<T>() { return new Nil<T>() }
  static cons<T>(head: T, tail: List<T>) {
    return new Cons<T>(head, tail);
  }
  static from<T>(list: T[]) {
    let c: List<T> = List.nil<T>();
    for (let i = list.length - 1; i >= 0; i--)
      c = List.cons<T>(list[i], c);
    return c;
  }
  static of<T>(...es: T[]) {
    return List.from(es);
  }

  abstract map<R>(fn: (val: T) => R): List<R>;
  abstract map2<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R>;
  abstract chain<R>(fn: (val: T) => List<R>): List<R>;

  abstract zip<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R>;

  abstract append(other: List<T>): List<T>;

  abstract toArray(): T[];

}

export class Nil<T> extends List<T> {

  constructor() { super() }

  toString() {
    return '()';
  }

  map<R>(fn: (val: T) => R): List<R> {
    return this as any as List<R>;
  }
  map2<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R> {
    return this as any as List<R>;
  }
  chain<R>(fn: (val: T) => List<R>): List<R> {
    return this as any as List<R>;
  }

  zip<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R> {
    return this as any as List<R>;
  }

  append(other: List<T>): List<T> {
    return other;
  }

  toArray() {
    return [];
  }

}

export class Cons<T> extends List<T> {

  constructor(
    public readonly head: T,
    public readonly tail: List<T>,
  ) { super() }

  toString() {
    return `(${this.head} : ${this.tail})`;
  }

  map<R>(fn: (val: T) => R): List<R> {
    return new Cons(fn(this.head), this.tail.map(fn));
  }
  map2<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R> {
    return this.chain(x => other.map(y => fn(x, y)));
  }
  chain<R>(fn: (val: T) => List<R>): List<R> {
    return fn(this.head).append(this.tail.chain(fn));
  }

  zip<T2, R>(fn: (val: T, val2: T2) => R, other: List<T2>): List<R> {
    return other instanceof Nil ?
      other as any as List<R> :
      new Cons(fn(this.head, (other as any).head), this.tail.zip(fn, (other as any).tail));
  }

  append(other: List<T>): List<T> {
    return new Cons(this.head, this.tail.append(other));
  }

  toArray() {
    return [this.head].concat(this.tail.toArray());
  }

}
