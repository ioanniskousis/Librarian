/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable import/extensions */
import { Library, Book } from './library.js';
import { gel, crel } from './syntax.js';
import dbSeed from './seed.js';
import { bookDeleteButton, bookReadCheckBox, bookLabel } from './bookPanelElements.js';

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
  checkBox.parentElement.book.swapRead();
  myLibrary.save();
  updateContentCaption();
}

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
    input.parentElement.book[label.dataItem] = newValue;
    myLibrary.save();
  }
  input.remove();
}

function inputBoxKeyPress(input, e) {
  if (input.value.length === 0) {
    input.value = input.referenceLabel.dataValue;
  }
  if (e.keyCode === 27) {
    input.value = input.referenceLabel.dataValue;
    input.blur();
  } else if (e.keyCode === 13) {
    input.blur();
  }
  if (input.referenceLabel.dataType === 'integer') {
    if ((e.keyCode < 48) || (e.keyCode > 57)) {
      e.preventDefault();
    }
  }
}

function editDataItem(label, select) {
  const input = crel('input');
  if (label.dataType === 'integer') input.pattern = '[0-9]';
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

function panelRemove(panel) {
  let pHeight = panel.offsetHeight;
  panel.innerHTML = '';
  panel.style.padding = '0';
  setInterval(
    () => {
      pHeight -= 5;
      panel.style.height = pHeight.toString().concat('px');
      if (pHeight <= 0) {
        panel.remove();
      }
    }, 10,
  );
}

function panelShow(panel) {
  let pHeight = 0;
  setInterval(
    () => {
      pHeight += 5;
      panel.style.height = pHeight.toString().concat('px');
      if (pHeight >= 110) {
        panel.style.height = '114px';
      }
    }, 10,
  );
}

function renderDeleteButton(bookPanel, book) {
  const deleteButton = bookDeleteButton();
  deleteButton.addEventListener('click', () => {
    const promptStr = 'Are you sure you want to remove \r'.concat(book.title).concat('\rfrom Library ?');
    const confirmDelete = confirm(promptStr);
    if (confirmDelete) {
      if (myLibrary.remove(book.id)) {
        const panel = gel('bookPanel'.concat(book.id));
        panelRemove(panel);
        updateContentCaption();
      }
    }
  });
  bookPanel.appendChild(deleteButton);
}

function renderBook(main, book) {
  const bookPanel = crel('div');
  bookPanel.className = 'bookPanel';

  renderAuthorLabel(bookPanel, book);
  renderTitleLabel(bookPanel, book);
  renderPagesLabel(bookPanel, book);
  renderReadCheckBox(bookPanel, book);
  renderDeleteButton(bookPanel, book);

  bookPanel.book = book;
  bookPanel.id = 'bookPanel'.concat(book.id);

  main.appendChild(bookPanel);
  panelShow(bookPanel);

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

  main.scrollTo(0, bookPanel.offsetTop + 114);

  bookPanel.edit(true);
}

gel('add-button').onclick = () => {
  addBookToLibrary();
};

window.addEventListener('load', () => {
  render();
});
