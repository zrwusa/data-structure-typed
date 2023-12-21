import { performance } from 'perf_hooks';

export const calcRunTime = (callback: (...args: any[]) => any) => {
  const startTime = performance.now();
  callback();
  return performance.now() - startTime;
};
