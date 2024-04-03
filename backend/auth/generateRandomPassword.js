import crypto from 'node:crypto';

const allowed =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const shuffledArray = (string) => {
  const array = string.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i);
    // Swapping
    const temp = array[i];
    array[i] = array[j];

    array[j] = temp;
  }
  return array;
};

const generateRandomPassword = (minLength, maxLength) => {
  return Array.from(Array(crypto.randomInt(minLength, maxLength + 1)).keys())
    .map(() => shuffledArray(allowed)[crypto.randomInt(allowed.length)])
    .join('');
};

export default generateRandomPassword;
