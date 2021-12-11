const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('finds true and false values', () => {
  let bool1 = true;
  let bool2 = false;
  expect(bool1).toBe(true);
  expect(bool2).toBe(false);
});