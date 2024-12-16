import { async } from 'regenerator-runtime';
// import * as config from './config.js' // imports all variables
import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js'; // refactored to AJAX in helper.js
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // Refactored in the helper.js folder
    // const res = await fetch(
    //   // `https://forkify-api.herokuapp.com/api/v2/recipes/${id}` // refactored in the config.js file
    //   `${API_URL}/${id}`
    // );
    // const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // console.log(res, data);

    // const data = await getJSON(`${API_URL}${id}`);
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch (err) {
    // alert(err);
    // Temporary error handling:
    console.error(`${err} 💥💥💥💣💣💣`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // Go to https://forkify-api.herokuapp.com/v2 and check under 'Get all recipe' section. Click on the example URL in the section and copy page link:
    const data = await AJAX(
      // `https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza`
      `${API_URL}?search=${query}&key=${KEY}`
    );
    console.log(data);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    // console.log(state.search.results);
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💣💣`);
    throw err;
  }
};

// loadSearchResults('pizza'); // called in controller.js

// To reach into the state and get the data for the page that is being requested:
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  // const start = (page - 1) * 10; // 0, if page = 1, then (1 - 1) * 10 = 0
  // const end = page * 10; // 9, slice() method doesn't include second parameter

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // Returns a part(first ten list) of the result:
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // newQuantity = oldQuantity * newServings / oldServings, 2 * 8 / 4 = 4
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// Bookmarking:
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark:
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked:
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// Removing Bookmark:
export const deleteBookmark = function (id) {
  // Delete bookmark:
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked anymore:
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el.trim()); // trim() removes space

        // if (ingArr !== 3)
        //   throw new Error(
        //     'Wrong ingredient format! Please use the correct format :)'
        //   );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(ingredients);
    console.log(recipe);

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
