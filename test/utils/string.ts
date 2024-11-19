/**
 * Convert any string to CamelCase format
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}

/**
 * Convert any string to SnakeCase format
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2') // Add underline between lowercase and uppercase letters
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '_'); // Replace non-alphanumeric characters with underscores
}

/**
 * Convert any string to PascalCase format (first letter capitalized)
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between lowercase and uppercase letters
    .replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumeric characters with spaces
    .split(' ') // Separate strings by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // The first letter is capitalized, the rest are lowercase
    .join(''); // Combine into a string
}

/**
 * Convert CamelCase or SnakeCase string to string format with specified separator
 */
export function toSeparatedCase(str: string, separator: string = '_'): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2')
    .replace(/[_\s]+/g, separator)
    .toLowerCase();
}

/**
 * Convert the string to all uppercase and delimit it using the specified delimiter
 */
export function toUpperSeparatedCase(
  str: string,
  separator: string = '_',
): string {
  return str
    .toUpperCase() // Convert all letters to uppercase
    .replace(/([a-z0-9])([A-Z])/g, '$1' + separator + '$2') // Add separator between lowercase letters and uppercase letters
    .replace(/[^A-Z0-9]+/g, separator) // Replace non-alphanumeric characters with separators
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // Remove the starting and ending separators
}
