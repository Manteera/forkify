import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

// The timeout function returns a new promise, which will reject after a certain number of time/seconds. This will prevent the error from returning continuosly:
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Refactoring getJSON and sendJSON previously used (check below):
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

/*

// To get JSON(Refactored into AJAX above):
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([
      fetch(
        // `https://forkify-api.herokuapp.com/api/v2/recipes/${id}` // refactored in the config.js file
        // `${API_URL}/${id}`
        url
      ),
      timeout(TIMEOUT_SEC), // after 10 or 5 or 0.5 seconds
    ]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // console.log(err);
    throw err; // ensures we get the error in the loadRecipe function in model.js, for example
  }
};

// To send JSON(Refactored into AJAX above):
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

*/
