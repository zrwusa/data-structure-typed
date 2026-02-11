export async function withMutedConsole<T>(fn: () => T | Promise<T>): Promise<T> {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  // Keep it minimal: silence during the callback, always restore.
  console.log = (() => undefined) as any;
  console.warn = (() => undefined) as any;
  console.error = (() => undefined) as any;

  try {
    return await fn();
  } finally {
    console.log = originalLog;
    console.warn = originalWarn;
    console.error = originalError;
  }
}

export function withPatched<T extends object, K extends keyof T, R>(
  obj: T,
  key: K,
  value: T[K],
  fn: () => R
): R {
  const original = obj[key];
  (obj as any)[key] = value;
  try {
    return fn();
  } finally {
    (obj as any)[key] = original;
  }
}
