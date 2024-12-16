import icons from 'url:../../img/icons.svg'; // Parcel 2

export default class View {
  _data;

  // Documentation(Go to "jsdoc.app" for more information):
  /**
   * Render the recieved object to the DOM (Description of the function we're documenting: when you hover on the render function, this documentation is displayed)
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Salawu Bassit
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); // guard clause(return) + error message(this.renderError()). Note that both are separate and not together like return this.renderError()

    this._data = data;
    const markUp = this._generateMarkup();

    if (!render) return markUp;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();

    this._data = data;
    const newMarkUp = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkUp); // converts string into real DOM node objects
    // const newElements = newDOM.querySelectorAll('*'); // selects all the elements in there
    const newElements = Array.from(newDOM.querySelectorAll('*')); // Array.from() converts nodelist to array
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    // console.log(currentElements);
    // console.log(newElements);

    // Comparing the elements:
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT:
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('😎 💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTES:
      if (!newEl.isEqualNode(curEl)) {
        // console.log(newEl.attributes);
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = ''; // removes previous content on the page
  }

  renderSpinner() {
    const spinnerMarkUp = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;

    // this._parentElement.innerHTML = ''; // OR:
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinnerMarkUp);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    // No recipes found for your query. Please try again!

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
