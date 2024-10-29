export const isDebugTest: boolean = false;
export const isCompetitor: boolean = false;
export const isTestStackOverflow = false;
export const SYSTEM_MAX_CALL_STACK = (function getMaxStackDepth(depth = 0) {
  try {
    return getMaxStackDepth(depth + 1);
  } catch (e) {
    return depth + 3000;
  }
})();
