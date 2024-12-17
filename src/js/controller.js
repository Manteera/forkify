import * as model from './model.js'; // imports everything including the named exports from model.js
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js'; // imports the view from the recipeView.js file
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// We have to import our icon file because the index.html in the dist folder is what Parcel is displaying in the browser. And there is no way for it to reach the icon files in our img folder:
// import icons from '../img/icons.svg'; // .. always means to go to the parent folder. Parcel 1
// import icons from 'url:../img/icons.svg'; // Parcel 2 - moved to recipeView.js
import 'core-js/stable'; // imports polyfill packages. for polyfilling everything else
import 'regenerator-runtime/runtime'; // imports polyfill packages. for polyfilling async await
import { async } from 'regenerator-runtime';
// console.log(icons);
// We can now use the icons variable in our code(markUp variable) below

// const recipeContainer = document.querySelector('.recipe');

// Hot module reloading(with Parcel). Not real JS or for JS. Coming from Parcel:
if (module.hot) {
  module.hot.accept();
} // the state of the page remains the same after reloading

// https://forkify-api.herokuapp.com/v2

// NOTE: We need parcel to execute or use sass/scss type of css files. Normal browsers cannot execute it. We discuss how to install sass using parcel in the terminal below.

///////////////////////////////////////
// To initialize and create our json.package file, enter "npm init" in the VSCode Terminal and follow the instructions to fill in properties or leave them blank
// In the scripts property of the package.json file, enter "start": "parcel index.html". Enter "build": "parcel build index.html" too
// In the package.json file, change the value of the "main" peoperty to "index.html" because it is our entry point. Didn't work. It has to be a JS file(e.g. index.js).
// To run parcel, we need to install it. Enter "npm i parcel -D" in the terminal to install the latest version that is available on npm for parcel. You can also use "npm i parcel@next -D". Or use "npm i parcel@2" to directly install version 2. Note that "-D" stands for devDependency
// Now let's start parcel by running our npm script in the terminal "npm start" or "npm run start"
// You may need to use "npm install sass" or "npm install sass@1.26.10" or "npm install sass@1.77.8" to install sass if it doesn't install automatically
// Command NO. 18: To escape/quit the terminal after executing a command, use "CTRL + C"

////////////////////////////////////////////////////////
// LOADING A RECIPE FROM API
console.log('TEST');
// Let's make our first API call using Jonas' own built API at this page: https://forkify-api.herokuapp.com/v2

// Refactored in/moved to our recipeView.js folder:
// const renderSpinner = function (parentEl) {
//   const spinnerMarkUp = `
//     <div class="spinner">
//       <svg>
//         <use href="${icons}#icon-loader"></use>
//       </svg>
//     </div>
//   `;

//   parentEl.innerHTML = '';
//   parentEl.insertAdjacentHTML('afterbegin', spinnerMarkUp);
// };

// NOTE: The function below was formerly named showRecipe()
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return; // guard clause
    // recipeView.renderSpinner(recipeContainer);
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1) Updating bookmarks view:
    bookmarksView.update(model.state.bookmarks); // highlights the right recipe in the boomark list when it's selected in the list

    // Our first API call:
    // 2) Loading the recipe:
    // renderSpinner(recipeContainer);
    await model.loadRecipe(id); // loadRecipe is an async function that returns a promise we have to handle with the await keyword

    // const { recipe } = model.state;

    // Refactored in/moved to our model.js folder:
    // const res = await fetch(
    //   // 'https://forkify-api.herokuapp.com/api/v2/recipes/664c8f193e7aa067e94e84c1'
    //   // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    //   `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    // ); // gotten from our API. Check the bottom of the page.

    // // const res = await fetch(
    // //   'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886zzz'
    // // ); // to trigger and handle error, let's enter the wrong link

    // const data = await res.json();

    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // console.log(res, data);
    // // let recipe = data.data.recipe // OR
    // let { recipe } = data.data;
    // recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    // console.log(recipe);

    // 3) Rendering the recipe:
    recipeView.render(model.state.recipe); // refactored

    // The inserted markup is gotten from our html file:
    // Refactored in the recipeView.js file:
    // const markUp = `
    //   <figure class="recipe__fig">
    //       <img src="${recipe.image}" alt="${
    //   recipe.title
    // }" class="recipe__img" />
    //       <h1 class="recipe__title">
    //         <span>${recipe.title}</span>
    //       </h1>
    //   </figure>

    //   <div class="recipe__details">
    //     <div class="recipe__info">
    //       <svg class="recipe__info-icon">
    //         <use href="${icons}#icon-clock"></use>
    //       </svg>
    //       <span class="recipe__info-data recipe__info-data--minutes">${
    //         recipe.cookingTime
    //       }</span>
    //       <span class="recipe__info-text">minutes</span>
    //     </div>
    //     <div class="recipe__info">
    //       <svg class="recipe__info-icon">
    //         <use href="${icons}#icon-users"></use>
    //       </svg>
    //       <span class="recipe__info-data recipe__info-data--people">${
    //         recipe.servings
    //       }</span>
    //       <span class="recipe__info-text">servings</span>

    //       <div class="recipe__info-buttons">
    //         <button class="btn--tiny btn--increase-servings">
    //           <svg>
    //             <use href="${icons}#icon-minus-circle"></use>
    //           </svg>
    //         </button>
    //         <button class="btn--tiny btn--increase-servings">
    //           <svg>
    //             <use href="${icons}#icon-plus-circle"></use>
    //           </svg>
    //         </button>
    //       </div>
    //     </div>

    //     <div class="recipe__user-generated">
    //       <svg>
    //         <use href="${icons}#icon-user"></use>
    //       </svg>
    //     </div>
    //     <button class="btn--round">
    //       <svg class="">
    //         <use href="${icons}#icon-bookmark-fill"></use>
    //       </svg>
    //     </button>
    //   </div>

    //   <div class="recipe__ingredients">
    //     <h2 class="heading--2">Recipe ingredients</h2>
    //     <ul class="recipe__ingredient-list">
    //       ${recipe.ingredients
    //         .map(ingredient => {
    //           return `
    //           <li class="recipe__ingredient">
    //             <svg class="recipe__icon">
    //               <use href="${icons}#icon-check"></use>
    //             </svg>
    //             <div class="recipe__quantity">${ingredient.quantity}</div>
    //             <div class="recipe__description">
    //               <span class="recipe__unit">${ingredient.unit}</span>
    //               ${ingredient.description}
    //             </div>
    //           </li>
    //         `;
    //         })
    //         .join('')}

    //     </ul>
    //   </div>

    //   <div class="recipe__directions">
    //     <h2 class="heading--2">How to cook it</h2>
    //     <p class="recipe__directions-text">
    //       This recipe was carefully designed and tested by
    //       <span class="recipe__publisher">${
    //         recipe.publisher
    //       }</span>. Please check out
    //       directions at their website.
    //     </p>
    //     <a
    //       class="btn--small recipe__btn"
    //       href="${recipe.sourceUrl}"
    //       target="_blank"
    //     >
    //       <span>Directions</span>
    //       <svg class="search__icon">
    //         <use href="${icons}#icon-arrow-right"></use>
    //       </svg>
    //     </a>
    //   </div>
    // `;

    // recipeContainer.innerHTML = ''; // removes previous content on the page
    // recipeContainer.insertAdjacentHTML('afterbegin', markUp);
  } catch (err) {
    // alert(err);
    // console.log(err);
    // recipeView.renderError(`${err} 💥💥💥💣💣💣`);
    recipeView.renderError(); // Since we didn't pass in any argument, the default is used
    console.error(err);
  }
};

// controlRecipes(); // we've called the function in the hash change event listener below

// Now lwt's add polyfills for ES6 features to our codebase:
// To do that, enter 'npm i core-js regenerator-runtime' in the terminal. Note that regenerator-runtime installs multiple packages at once.
// Then all we have to do is to import these packages at the top of our file (Check top of this file). And that's it for polyfilling.

////////////////////////////////////////////////////////
// RENDERING THE RECIPE
// After loading the recipe data from our API, now let's render that data in our application. Check the controlRecipes() function above for the rendering.

////////////////////////////////////////////////////////
// LISTENING FOR LOAD AND HASHCHANGE EVENTS
// Let's now add some events listeners to our application and simulate that we already have some search results in place
// To listen to the hash change event when the user clicks a recipe:
// window.addEventListener('hashchange', controlRecipes);

// We also have to listen for the load event, when the hash loads in a new page:
// window.addEventListener('load', controlRecipes);

// To prevent duplicate code as above, we can do all at the same time. Even when we have to listen to multiple events:
// ['hashchange', 'load'].forEach(event =>
//   window.addEventListener(event, controlRecipes)
// ); // refactored or moved to the recipeView.js folder

// What if we don't any hash in our url? We use an if-else statement and guard clause in the controlRecipes function. Check above

////////////////////////////////////////////////////////
// THE MVC ARCHITECTURE: MODEL-VIEW-CONTROLLER ARCHITECTURE
// Watch again. It's very important.

////////////////////////////////////////////////////////
// REFACTORING FOR MVC
// We created the model.js and recipeView.js files and refactored our codes in them.

// We also want to change to 0.5 numbering for recipes to 1/2. Google search "npm fractional". Used in the recipeView.js file.

////////////////////////////////////////////////////////
// HELPERS AND CONFIGURATION FILES
// We created the config.js file for constant and reusable variables. These variable define important data about the project. They allow us to easily configure our project by simply changing some of the data in this configuration file.
// We also created helper.js for helper functions. It will contain a couple of functions that we will reuse over and over again.

////////////////////////////////////////////////////////
// EVENT HANDLERS IN MVC: PUBLISHER-SUBSCRIBER PATTERN
// Watch again
// const init = function () {
//   recipeView.addHandlerRender(controlRecipes);
//   searchView.addHandlerSearch(controlSearchResults);
// }; // moved down
// init(); // moved down

////////////////////////////////////////////////////////
// IMPLEMENTING ERROR AND SUCCESS MESSAGES
// Check recipeView.js file

////////////////////////////////////////////////////////
// IMPLEMENTING SEARCH RESULTS - PART 1
// Check model.js file
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query:
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results:
    await model.loadSearchResults(query);

    // 3) Render results:
    // console.log(model.state.search.results); // moved here from model.js
    // resultsView.render(model.state.search.results); // previously
    resultsView.render(model.getSearchResultsPage()); // first ten results

    // 4) Render initial pagination buttons:
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults(); called in the init function above

const controlPagination = function (gotoPage) {
  // console.log('Pagination controller');
  // console.log(gotoPage);

  // 1) Render NEW results:
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // 2) Render NEW pagination buttons:
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark:
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  console.log(model.state.recipe);
  // 2) Update recipe view:
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks:
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    // Show loading spinner:
    addRecipeView.renderSpinner();

    // Upload the new recipe data:
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe:
    recipeView.render(model.state.recipe);

    // Success message:
    addRecipeView.renderMessage();

    // Render bookmark view:
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL:
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // pushState() changes the URL without reloading the page
    // window.history.back // goes back to the last page but not useful here

    // Close form window:
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // controlServings(); // won't work due to async nature of state.recipe

  newFeature();
};
init();

// IMPLEMENTING SEARCH RESULTS - PART 2
// We created the resultsView.js to render our result on the webpage and refactor our code

////////////////////////////////////////////////////////
// IMPLEMENTING PAGINATION - PART 1
// We want 10 results in the pagination at a time. So, we are going to use the next and previous buttons to move to the remaining results
// Check the model.js folder for getSearchResultsPage function

// IMPLEMENTING PAGINATION - PART 2
// We executed the forward and backward buttons. We created the paginationView.js
// const controlPagination = function () {
//   console.log('Page controller');
// }; moved up

////////////////////////////////////////////////////////
//  PROJECT PLANNING 2
// To do for upcoming lectures/sections

////////////////////////////////////////////////////////
// UPDATING RECIPE SERVINGS
// const controlServings = function () {
//   // Update recipe servings (in state)
//   model.updateServings(8);

//   // Update the recipe view
//   recipeView.render(model.state.recipe);
// }; // moved up

////////////////////////////////////////////////////////
// DEVELOPING A DOM UPDATING ALGORITHM
// In the controlServings function above, we used the update() method instead of the render() method which reloads the whole page

////////////////////////////////////////////////////////
// IMPLEMENTING BOOKMARKS 1
// const controlAddBookmark = function () {
//   model.addBookmark(model.state.recipe);
//   console.log(model.state.recipe);
// }; // moved up

// IMPLEMENTING BOOKMARKS 2

////////////////////////////////////////////////////////
// STORING BOOKMARKS WITH LOCALSTORAGE

////////////////////////////////////////////////////////
// PROJECT PLANNING III

////////////////////////////////////////////////////////
// UPLOADING A NEW/USER'S OWN RECIPE - PART 1

// UPLOADING A NEW/USER'S OWN RECIPE - PART 2

// UPLOADING A NEW/USER'S OWN RECIPE - PART 3

////////////////////////////////////////////////////////
// SETTING UP GIT AND DEPLOYMENT

// Search for "github git cheatsheet." Click on the Git cheatsheet(Git Education) page and explore the commands.
