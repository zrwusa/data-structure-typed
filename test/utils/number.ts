export function getRandomInt(min: number = 0, max: number = 1000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function numberFix(num: number, decimalPlaces: number): string {
  if (num > 10000 || num < 0.001) {
    const [mantissa, exponent] = num.toExponential().split('e');
    const formattedMantissa = Number(mantissa).toFixed(decimalPlaces);
    return `${formattedMantissa}e${exponent}`;
  } else {
    return num.toFixed(decimalPlaces);
  }
}
