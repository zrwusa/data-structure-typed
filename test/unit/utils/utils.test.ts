describe('isNaN', () => {
  it('should isNaN', function () {
    expect(isNaN('string' as unknown as number)).toBe(true);
  });
});
