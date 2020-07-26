export function Library() {
  this.books = [];
  this.length = () => this.books.length;

  this.find = (id) => {
    for (let index = 0; index < this.books.length; index += 1) {
      const element = this.books[index];
      if (element.id === id) {
        return index;
      }
    }
    return -1;
  };

  this.add = (book) => this.books.push(book);

  this.remove = (id) => {
    const index = this.find(id);
    if (index !== -1) {
      this.books.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  };

  this.save = () => {
    localStorage.setItem('myLibrary', JSON.stringify(this.books));
  };

  this.newID = () => {
    if (this.books.length === 0) {
      return 1;
    }
    return this.books[this.books.length - 1].id + 1;
  };

  function bookIsRead(book) {
    return book.read === true;
  }

  this.booksRead = () => this.books.filter(bookIsRead).length;
}

export function Book(id, author, title, numOfPages, read = false) {
  this.id = id;
  this.author = author;
  this.title = title;
  this.numOfPages = numOfPages;
  this.read = read;

  this.swapRead = () => {
    this.read = !this.read;
  };
}
