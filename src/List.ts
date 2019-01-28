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

  append(other: List<T>): List<T> {
    return new Cons(this.head, this.tail.append(other));
  }

  toArray() {
    return [this.head].concat(this.tail.toArray());
  }

}
