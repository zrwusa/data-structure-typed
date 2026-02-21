import { performance } from 'perf_hooks';
export const calcRunTime = (callback) => {
  const startTime = performance.now();
  callback();
  return performance.now() - startTime;
};
