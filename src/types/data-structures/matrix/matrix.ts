export type MatrixOptions = {
  rows?: number;
  cols?: number;
  addFn?: (a: number, b: number) => any;
  subtractFn?: (a: number, b: number) => any;
  multiplyFn?: (a: number, b: number) => any;
};
