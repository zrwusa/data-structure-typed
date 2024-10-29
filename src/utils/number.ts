/**
 * The function `toBinaryString` converts a number to a binary string representation with a specified
 * number of digits.
 * @param {number} num - The `num` parameter in the `toBinaryString` function represents the number
 * that you want to convert to a binary string.
 * @param [digit=32] - The `digit` parameter in the `toBinaryString` function represents the number of
 * digits the binary string should have. By default, it is set to 32, meaning that the binary string
 * will be padded with zeros at the beginning to ensure it is 32 bits long. You can provide a
 * @returns The function `toBinaryString` takes a number as input and converts it to a binary string
 * representation with a specified number of digits (default is 32). The binary string is padded with
 * zeros at the beginning to ensure it has the specified number of digits. The function returns the
 * binary string representation of the input number.
 */
export function toBinaryString(num: number, digit = 32) {
  // Convert number to binary string
  let binaryString = (num >>> 0).toString(2); // Use the unsigned right shift operator to ensure you get a binary representation of a 32-bit unsigned integer

  // Use pad Start to ensure the string length is 32 bits
  binaryString = binaryString.padStart(digit, '0');

  return binaryString;
}
