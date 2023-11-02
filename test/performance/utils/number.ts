export function numberFix(number: number, decimalPlaces: number): string {

  if (number > 10000 || number < 0.001) {
    const [mantissa, exponent] = number.toExponential().split('e');
    const formattedMantissa = Number(mantissa).toFixed(decimalPlaces);
    return `${formattedMantissa}e${exponent}`;
  } else {
    return number.toFixed(decimalPlaces);
  }
}