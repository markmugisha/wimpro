fetch('https://google.com', function (err, googleData) {
  if (err) handleError();
  else
    fetch('https://facebook.com', function (err, facebookData) {
      if (err) handleError();
      else
        fetch('https://instagram.com', function (err, instagramData) {
          if (err) handleError();
          else
            fetch('https://microsoft.com', function (err, microsoftData) {
              console.log(microsoftData);
            });
        });
    });
});

fetch('https://google.com').then((response) => {
  response.json().then((googleData) => {
    fetch('https://facebook.com').then((response) => {
      response.json().then((facebookData) => {
        fetch('https://instagram.com').then((response) => {
          response.json().then((instagramData) => {
            fetch('https://microsoft.com').then((response) => {
              response.json().then((microsoftData) => {
                console.log(microsoftData);
              });
            });
          });
        });
      });
    });
  });
});

/**
 * 1. You can call the method .then() on Promises
 * 2. The .then() method always returns a Promise
 * 3. Ergo, you can call a .then() on any .then()
 *
 * Explanation
 * If a .then() always returns a Promise, then it's value is effectively equivalent to a Promise
 * So, given the code Promise.then()
 * Since a .then() === Promise, let's replace the Promise in the code above with a .then()
 * Promise.then() === .then().then()
 */

fetch('https://google.com')
  .then((response) => response.json())
  .then((googleData) => fetch('https://facebook.com'))
  .then((response) => response.json())
  .then((facebookData) => fetch('https://instagram.com'))
  .then((response) => response.json())
  .then((instagramData) => fetch('https://microsoft.com'))
  .then((response) => response.json())
  .then((microsoftData) => console.log(microsoftData));

console.log('hello');

const googleResponse = await fetch('https://google.com');
const googleData = await googleResponse.json();
const facebookResponse = await fetch('https://facebook.com');
const facebookData = await facebookResponse.json();
const instagramResponse = await fetch('https://instagram.com');
const instagramData = await instagramResponse.json();
const microsoftResponse = await fetch('https://microsoft.com');
const microsoftData = await microsoftResponse.json();
console.log(microsoftData);
