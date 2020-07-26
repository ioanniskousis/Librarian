/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/extensions */
import { Library, Book } from './library.js';
import gel from './syntax.js';
import dbSeed from './seed.js';
import { bookDeleteButton, bookReadCheckBox, bookLabel } from './bookPanelElements.js';

/* syntax */

// function gel(id) {
//   return document.getElementById(id);
// }


/* library */

// function Library() {
//   this.books = [];
//   this.length = () => this.books.length;

//   this.find = (id) => {
//     for (let index = 0; index < this.books.length; index += 1) {
//       const element = this.books[index];
//       if (element.id === id) {
//         return index;
//       }
//     }
//     return -1;
//   };

//   this.add = (book) => this.books.push(book);

//   this.remove = (id) => {
//     const index = this.find(id);
//     if (index !== -1) {
//       this.books.splice(index, 1);
//       this.save();
//       return true;
//     }
//     return false;
//   };

//   this.save = () => {
//     localStorage.setItem('myLibrary', JSON.stringify(this.books));
//   };

//   this.newID = () => {
//     if (this.books.length === 0) {
//       return 1;
//     }
//     return this.books[this.books.length - 1].id + 1;
//   };

//   function bookIsRead(book) {
//     return book.read === true;
//   }

//   this.booksRead = () => this.books.filter(bookIsRead).length;
// }

// function Book(id, author, title, numOfPages, read = false) {
//   this.id = id;
//   this.author = author;
//   this.title = title;
//   this.numOfPages = numOfPages;
//   this.read = read;

//   this.swapRead = () => {
//     this.read = !this.read;
//   };
// }


// /* bookPanelElements */

// function bookDeleteButton() {
//   const deleteDiv = document.createElement('div');
//   deleteDiv.className = 'bookDelete';
//   return deleteDiv;
// }

// function bookReadCheckBox(book) {
//   const checkLabel = document.createElement('label');
//   checkLabel.className = 'label-for-checkbox';
//   checkLabel.htmlFor = 'readCheck'.concat(book.id);
//   checkLabel.innerHTML = 'read';

//   const readCheck = document.createElement('input');
//   readCheck.type = 'checkbox';
//   readCheck.id = 'readCheck'.concat(book.id);
//   readCheck.className = 'custom-checkbox';
//   readCheck.checked = book.read;

//   checkLabel.appendChild(readCheck);

//   return checkLabel;
// }

// function setupAuthorLabel(book, label) {
//   label.dataType = 'text';
//   label.dataItem = 'author';
//   label.id = 'authorLabel'.concat(book.id);
//   label.className = 'bookLabel authorBox';
//   label.xClass = 'authorBox';
//   label.innerHTML = book.author;
//   label.dataValue = book.author;
//   label.postFix = '';
// }

// function setupTitleLabel(book, label) {
//   label.dataType = 'text';
//   label.dataItem = 'title';
//   label.id = 'titleLabel'.concat(book.id);
//   label.className = 'bookLabel titleBox';
//   label.xClass = 'titleBox';
//   label.innerHTML = book.title;
//   label.dataValue = book.title;
//   label.postFix = '';
// }

// function setupPagesLabel(book, label) {
//   label.dataType = 'integer';
//   label.dataItem = 'numOfPages';
//   label.id = 'pagesLabel'.concat(book.id);
//   label.className = 'bookLabel pagesBox';
//   label.xClass = 'pagesBox';
//   label.innerHTML = parseInt(book.numOfPages, 10).toString().concat(' pages');
//   label.dataValue = parseInt(book.numOfPages, 10);
//   label.postFix = ' pages';
// }

// function bookLabel(book, dataitem) {
//   const label = document.createElement('label');
//   let setup = null;
//   switch (dataitem) {
//     case 'author':
//       setup = setupAuthorLabel;
//       break;
//     case 'title':
//       setup = setupTitleLabel;
//       break;
//     case 'pages':
//       setup = setupPagesLabel;
//       break;
//     default:
//       break;
//   }
//   if (setup) setup(book, label);

//   return label;
// }

/* dbseed */

// function dbSeed(libray) {
//   libray.add(new Book(1, 'John Scipper', 'Elements of Choise', 234));
//   libray.add(new Book(2, 'Dan Brown', 'Hit by the Light', 432));
//   libray.add(new Book(3, 'Charly Humburg', 'Tournaments', 567, true));
//   libray.add(new Book(4, 'Jack Flint', 'Fear of Fun', 1099));
//   libray.add(new Book(5, 'William Timerlon', 'The Dust Of Horses', 608));
//   libray.add(new Book(6, 'George Hamilton', 'Sand For Gold', 403, true));
// }

/* main */

const myLibrary = new Library();
const storage = JSON.parse(localStorage.getItem('myLibrary'));
if (storage) {
  storage.forEach((book) => {
    myLibrary.add(new Book(book.id, book.author, book.title, book.numOfPages, book.read));
  });
}

if (myLibrary.length() === 0) {
  dbSeed(myLibrary);
}

function updateContentCaption() {
  const noBooks = 'There are no books in the library';
  const libLen = myLibrary.length();
  const someBooks = libLen.toString().concat(' book').concat(libLen === 1 ? '' : 's');
  gel('books-count').innerHTML = libLen === 0 ? noBooks : someBooks;
  const booksRead = myLibrary.booksRead();
  const read = libLen === 0 ? '' : (booksRead === 0 ? 'none' : booksRead.toString()).concat(' read');
  gel('books-read').innerHTML = read;
}

function readCheckClick(checkBox) {
  // const book = checkBox.parentElement.book;
  checkBox.parentElement.book.swapRead();
  myLibrary.save();
  updateContentCaption();
}

// function deleteBookClick() {

// }

function inputBoxFocusOut(input) {
  const label = input.referenceLabel;
  if (input.value !== label.dataValue) {
    const expectsNumber = (label.dataType === 'integer') || (label.dataType === 'float');
    const isNotNumeric = Number.isNaN(parseInt(input.value, 10));
    let newValue;
    if (label.dataType === 'integer') {
      newValue = parseInt(input.value, 10);
    } else if (label.dataType === 'float') {
      newValue = parseFloat(input.value);
    } else {
      newValue = input.value;
    }
    if (isNotNumeric && (expectsNumber)) newValue = 0;
    label.textContent = newValue + label.postFix;
    label.dataValue = newValue;
    // let book = input.parentElement.book;
    input.parentElement.book[label.dataItem] = newValue;
    myLibrary.save();
  }
  input.remove();
}

function inputBoxKeyPress(input, e) {
  if (e.keyCode === 27) {
    input.value = input.referenceLabel.dataValue;
    input.blur();
  } else if (e.keyCode === 13) {
    input.blur();
  }
}

function editDataItem(label, select) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'bookTextBox'.concat(' ').concat(label.xClass);
  input.referenceLabel = label;
  input.value = label.dataValue;

  label.parentElement.appendChild(input);

  input.addEventListener('focusout', () => {
    inputBoxFocusOut(input);
  });

  input.addEventListener('keypress', e => {
    inputBoxKeyPress(input, e);
  });

  input.focus();
  if (select) input.select();
}

function renderAuthorLabel(bookPanel, book) {
  const authorLabel = bookLabel(book, 'author');
  authorLabel.addEventListener('click', () => {
    editDataItem(authorLabel, false);
  });
  bookPanel.appendChild(authorLabel);
}

function renderTitleLabel(bookPanel, book) {
  const titleLabel = bookLabel(book, 'title');
  titleLabel.addEventListener('click', () => {
    editDataItem(titleLabel, false);
  });
  bookPanel.appendChild(titleLabel);
}

function renderPagesLabel(bookPanel, book) {
  const pagesLabel = bookLabel(book, 'pages');
  pagesLabel.addEventListener('click', () => {
    editDataItem(pagesLabel, false);
  });
  bookPanel.appendChild(pagesLabel);
}

function renderReadCheckBox(bookPanel, book) {
  const readCheck = bookReadCheckBox(book);
  readCheck.addEventListener('click', () => {
    readCheckClick(readCheck);
  });
  bookPanel.appendChild(readCheck);
}

function renderDeleteButton(bookPanel, book) {
  const deleteButton = bookDeleteButton();
  deleteButton.addEventListener('click', () => {
    const promptStr = 'Are you sure you want to remove \r'.concat(book.title).concat('\rfrom Library ?');
    const confirmDelete = confirm(promptStr);
    if (confirmDelete) {
      if (myLibrary.remove(book.id)) {
        const panel = gel('bookPanel'.concat(book.id));
        panel.remove();
        updateContentCaption();
      }
    }
  });
  bookPanel.appendChild(deleteButton);
}

function renderBook(main, book) {
  const bookPanel = document.createElement('div');
  bookPanel.className = 'bookPanel';

  renderAuthorLabel(bookPanel, book);
  renderTitleLabel(bookPanel, book);
  renderPagesLabel(bookPanel, book);
  renderReadCheckBox(bookPanel, book);
  renderDeleteButton(bookPanel, book);

  bookPanel.book = book;
  bookPanel.id = 'bookPanel'.concat(book.id);

  main.appendChild(bookPanel);

  bookPanel.edit = (select = false) => {
    editDataItem(gel('authorLabel'.concat(book.id)), select);
  };

  return bookPanel;
}

function render() {
  const main = gel('main-content');
  main.innerHTML = '';
  myLibrary.books.forEach((book) => {
    renderBook(main, book);
  });
  updateContentCaption();
}

function addBookToLibrary() {
  const newID = myLibrary.newID();
  const book = new Book(newID, 'unknown author', 'book title '.concat(newID), 0);
  myLibrary.add(book);
  const main = gel('main-content');
  const bookPanel = renderBook(main, book);
  updateContentCaption();
  myLibrary.save();

  main.scrollTo(0, bookPanel.offsetTop);

  bookPanel.edit(true);
}

gel('add-button').onclick = () => {
  addBookToLibrary();
};

window.addEventListener('load', () => {
  render();
});
