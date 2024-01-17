export function toBinaryString(num: number, digit = 32) {
  // Convert number to binary string
  let binaryString = (num >>> 0).toString(2); // Use the unsigned right shift operator to ensure you get a binary representation of a 32-bit unsigned integer

  // Use pad Start to ensure the string length is 32 bits
  binaryString = binaryString.padStart(digit, '0');

  return binaryString;
}
