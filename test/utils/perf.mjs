// Re-export utilities for performance tests (ESM)
export const magnitude = {
  MILLION: 1000000,
  HUNDRED_THOUSAND: 100000,
  TEN_THOUSAND: 10000,
  THOUSAND: 1000,
  HUNDRED: 100
};

export function getRandomInt(min = 0, max = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntArray(length, min = 0, max = 1000) {
  return Array.from({ length }, () => getRandomInt(min, max));
}

export function getRandomIndex(length) {
  return Math.floor(Math.random() * length);
}

export function getRandomWords(count, minLength = 3, maxLength = 10) {
  const words = [];
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < count; i++) {
    const length = getRandomInt(minLength, maxLength);
    let word = '';
    for (let j = 0; j < length; j++) {
      word += chars[Math.floor(Math.random() * chars.length)];
    }
    words.push(word);
  }
  return words;
}
