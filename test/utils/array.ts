import {randomInt} from './number';

export const randomIntArray = (length: number, min: number = -1000, max: number = 1000) => {
  return new Array<number>(length).fill(0).map(() => randomInt(min, max));
};
