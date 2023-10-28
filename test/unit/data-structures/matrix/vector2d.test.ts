import {Vector2D} from '../../../../src';

describe('Vector2D', () => {
  it('should create a vector with default values', () => {
    const vector = new Vector2D();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
    expect(vector.w).toBe(1);
  });

  it('should correctly check if a vector is zero', () => {
    const nonZeroVector = new Vector2D(3, 4);
    const zeroVector = new Vector2D(0, 0);
    expect(nonZeroVector.isZero).toBe(false);
    expect(zeroVector.isZero).toBe(true);
  });

  it('should correctly calculate vector length', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.length).toBe(5);
  });

  it('should correctly calculate squared vector length', () => {
    const vector = new Vector2D(3, 4);
    expect(vector.lengthSq).toBe(25);
  });

  it('should correctly round vector components', () => {
    const vector = new Vector2D(3.6, 4.3);
    const roundedVector = vector.rounded;
    expect(roundedVector.x).toBe(4);
    expect(roundedVector.y).toBe(4);
  });

  it('should correctly add two vectors', () => {
    const vector1 = new Vector2D(2, 3);
    const vector2 = new Vector2D(1, 2);
    const result = Vector2D.add(vector1, vector2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(5);
  });

  it('should correctly subtract two vectors', () => {
    const vector1 = new Vector2D(4, 5);
    const vector2 = new Vector2D(1, 2);
    const result = Vector2D.subtract(vector1, vector2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(3);
  });

  it('should correctly subtract value from a vector', () => {
    const vector = new Vector2D(5, 7);
    const result = Vector2D.subtractValue(vector, 3);
    expect(result.x).toBe(2);
    expect(result.y).toBe(4);
  });

  it('should correctly multiply a vector by a value', () => {
    const vector = new Vector2D(2, 3);
    const result = Vector2D.multiply(vector, 4);
    expect(result.x).toBe(8);
    expect(result.y).toBe(12);
  });

  it('should correctly divide a vector by a value', () => {
    const vector = new Vector2D(6, 8);
    const result = Vector2D.divide(vector, 2);
    expect(result.x).toBe(3);
    expect(result.y).toBe(4);
  });

  it('should correctly check if two vectors are equal', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(3, 4);
    const vector3 = new Vector2D(4, 5);
    expect(Vector2D.equals(vector1, vector2)).toBe(true);
    expect(Vector2D.equals(vector1, vector3)).toBe(false);
  });

  it('should correctly check if two vectors are equal within a rounding factor', () => {
    const vector1 = new Vector2D(3, 4);
    const vector2 = new Vector2D(2.9, 3.9);
    const vector3 = new Vector2D(4, 5);
    expect(Vector2D.equalsRounded(vector1, vector2, 0.2)).toBe(true);
    expect(Vector2D.equalsRounded(vector1, vector3, 0.2)).toBe(false);
  });

  it('should correctly normalize a vector', () => {
    const vector = new Vector2D(3, 4);
    const normalized = Vector2D.normalize(vector);
    expect(normalized.x).toBeCloseTo(0.6);
    expect(normalized.y).toBeCloseTo(0.8);
  });

  it('should correctly truncate a vector', () => {
    const vector = new Vector2D(3, 4);
    const truncated = Vector2D.truncate(vector, 4);
    expect(truncated.length).toBeLessThanOrEqual(4);
  });

  it('should correctly get the perpendicular vector', () => {
    const vector = new Vector2D(3, 4);
    const perpendicular = Vector2D.perp(vector);
    expect(Vector2D.dot(vector, perpendicular)).toBe(0);
  });

  it('should correctly reverse the vector', () => {
    const vector = new Vector2D(3, 4);
    const reversed = Vector2D.reverse(vector);
    expect(reversed.x).toBe(-3);
    expect(reversed.y).toBe(-4);
  });

  it('should correctly get the absolute vector', () => {
    const vector = new Vector2D(-3, 4);
    const absVector = Vector2D.abs(vector);
    expect(absVector.x).toBe(3);
    expect(absVector.y).toBe(4);
  });

  it('should correctly calculate the dot product of two vectors', () => {
    const vector1 = new Vector2D(2, 3);
    const vector2 = new Vector2D(4, 5);
    const dotProduct = Vector2D.dot(vector1, vector2);
    expect(dotProduct).toBe(23);
  });

  it('should correctly calculate the distance between two vectors', () => {
    const vector1 = new Vector2D(1, 1);
    const vector2 = new Vector2D(4, 5);
    const distance = Vector2D.distance(vector1, vector2);
    expect(distance).toBeCloseTo(5);
  });

  it('should correctly calculate the squared distance between two vectors', () => {
    const vector1 = new Vector2D(1, 1);
    const vector2 = new Vector2D(4, 5);
    const distanceSq = Vector2D.distanceSq(vector1, vector2);
    expect(distanceSq).toBe(25);
  });

  it('should correctly determine the sign of the cross product of two vectors', () => {
    const vector1 = new Vector2D(2, 3);
    const vector2 = new Vector2D(4, 5);
    const sign = Vector2D.sign(vector1, vector2);
    expect(sign).toBe(-1); // Assuming specific vector values, the result may vary
  });

  it('should correctly calculate the angle between a vector and the negative y-axis', () => {
    const vector = new Vector2D(3, 4);
    const angle = Vector2D.angle(vector);
    expect(angle).toBeCloseTo(2.498091544796509, 3);
  });

  it('should create a random vector within the specified range', () => {
    const maxX = 10;
    const maxY = 10;
    const randomVector = Vector2D.random(maxX, maxY);
    expect(randomVector.x).toBeGreaterThanOrEqual(-maxX / 2);
    expect(randomVector.x).toBeLessThanOrEqual(maxX / 2);
    expect(randomVector.y).toBeGreaterThanOrEqual(-maxY / 2);
    expect(randomVector.y).toBeLessThanOrEqual(maxY / 2);
  });

  it('should zero the vector components', () => {
    const vector = new Vector2D(3, 4);
    vector.zero();
    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });
});
