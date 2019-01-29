import { multiplication, concatenation } from "./Monoid";

console.log(multiplication.fold([1, 2, 3, 4, 5]));
console.log(concatenation<number>().fold([[1, 2], [3, 4], [5, 6]]));
