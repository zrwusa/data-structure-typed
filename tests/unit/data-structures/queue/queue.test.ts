import {Queue} from '../../../../src';
import {bigO, magnitude} from '../../../utils';

describe('Queue Operation Test', () => {

  it('should validate a queue', () => {
    const queue = new Queue<number>();
    for (let i = 0; i < 1000; i++) {
      queue.enqueue(i);
    }
    let last: number | undefined = 0;
    for (let i = 0; i < 1000; i++) {
      last = queue.dequeue();
    }
    expect(last).toBe(999);
  });

});

describe('Queue Performance Test', () => {
  it('should numeric queue performance well', function () {
    const queue = new Queue<number>();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      queue.enqueue(i);
    }
    let last: number | undefined = 0;

    const startTime = performance.now();
    for (let i = 0; i < magnitude.LINEAR; i++) {
      last = queue.dequeue();
    }
    expect(last).toBe(magnitude.LINEAR - 1);
    expect(performance.now() - startTime).toBeLessThan(bigO.LINEAR * 100);

  });
})
