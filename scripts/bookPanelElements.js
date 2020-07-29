/* eslint-disable import/extensions */
import { crel } from './syntax.js';

export function bookDeleteButton() {
  const deleteDiv = crel('div');
  deleteDiv.className = 'bookDelete';
  return deleteDiv;
}

export function bookReadCheckBox(book) {
  const checkLabel = crel('label');
  checkLabel.className = 'label-for-checkbox';
  checkLabel.htmlFor = 'readCheck'.concat(book.id);
  checkLabel.innerHTML = 'read';

  const readCheck = crel('input');
  readCheck.type = 'checkbox';
  readCheck.id = 'readCheck'.concat(book.id);
  readCheck.className = 'custom-checkbox';
  readCheck.checked = book.read;

  checkLabel.appendChild(readCheck);

  return checkLabel;
}

function setupAuthorLabel(book, label) {
  label.dataType = 'text';
  label.dataItem = 'author';
  label.id = 'authorLabel'.concat(book.id);
  label.className = 'bookLabel authorBox';
  label.xClass = 'authorBox';
  label.innerHTML = book.author;
  label.dataValue = book.author;
  label.postFix = '';
}

function setupTitleLabel(book, label) {
  label.dataType = 'text';
  label.dataItem = 'title';
  label.id = 'titleLabel'.concat(book.id);
  label.className = 'bookLabel titleBox';
  label.xClass = 'titleBox';
  label.innerHTML = book.title;
  label.dataValue = book.title;
  label.postFix = '';
}

function setupPagesLabel(book, label) {
  label.dataType = 'integer';
  label.dataItem = 'numOfPages';
  label.id = 'pagesLabel'.concat(book.id);
  label.className = 'bookLabel pagesBox';
  label.xClass = 'pagesBox';
  label.innerHTML = parseInt(book.numOfPages, 10).toString().concat(' pages');
  label.dataValue = parseInt(book.numOfPages, 10);
  label.postFix = ' pages';
}

export function bookLabel(book, dataitem) {
  const label = crel('label');
  let setup = null;
  switch (dataitem) {
    case 'author':
      setup = setupAuthorLabel;
      break;
    case 'title':
      setup = setupTitleLabel;
      break;
    case 'pages':
      setup = setupPagesLabel;
      break;
    default:
      break;
  }
  if (setup) setup(book, label);

  return label;
}
