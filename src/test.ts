import { multiplication, concatenation } from "./Monoid";
import Thunk, { Trampoline } from "./Thunk";

console.log(multiplication.fold([1, 2, 3, 4, 5]));
console.log(concatenation<number>().fold([[1, 2], [3, 4], [5, 6]]));

const facR = (x: number, y: number): Trampoline<number> =>
  x < 2 ? y : new Thunk(() => facR(x - 1, x * y));
const fac = (x: number) => facR(x, 1);
const facT = Thunk.trampoline(fac);

console.log(facT(300));
