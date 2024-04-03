const sumA = (array) => {
  let total = 0;
  for (let number of array) {
    total += number;
  }
  return total;
};

const sumB = (array) => {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i];
  }
  return total;
};

const sumR = (array) => {
  const total = array.reduce((totalSoFar, current) => totalSoFar + current, 0);
  return total;
};

const array = [
  5, 10, 3, 8, 12, 9, 1, 20, 15, 7, 18, 6, 14, 2, 11, 17, 4, 13, 19, 16,
];
console.log(sumA(array));
console.log(sumB(array));
console.log(sumR(array));

const x = [2, 12, 32, 1, 9];

// (totalSoFar, current) => totalSoFar + current
// (0, 2) => 0 + 2
// (2, 12) => 2 + 12
// (14, 32) => 14 + 32
// (46, 1) => 46 + 1
// (47, 9) => 47 + 9

const fruits = [
  'apple',
  'banana',
  'orange',
  'apple',
  'grape',
  'banana',
  'apple',
];
// {apple: 3, banana: 2, orange: 1, grape: 1}
const fruitStats = fruits.reduce((stats, currentFruit) => {
  if (stats[currentFruit]) {
    stats[currentFruit]++;
  } else {
    stats[currentFruit] = 1;
  }
  return stats;
}, {});

console.log(fruitStats);
