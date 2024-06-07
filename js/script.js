const books = [];
const RENDER_EVENT = "render-books";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    bookTitle,
    bookAuthor,
    bookYear,
    bookIsComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  for (const book of books) {
    const bookItem = makeBookItem(book);
    if (!book.isComplete) {
      incompleteBookshelfList.append(bookItem);
    } else {
      completeBookshelfList.append(bookItem);
    }
  }
});

function makeBookItem(book) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const button = document.createElement("button");
  if (book.isComplete) {
    button.innerText = "Belum selesai di Baca";
    button.classList.add("green");
    button.addEventListener("click", function () {
      markAsIncomplete(book.id);
    });
  } else {
    button.innerText = "Selesai dibaca";
    button.classList.add("red");
    button.addEventListener("click", function () {
      markAsComplete(book.id);
    });
  }

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus buku";
  deleteButton.classList.add("red");
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
  });

  actionContainer.append(button, deleteButton);

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(bookTitle, bookAuthor, bookYear, actionContainer);

  return bookItem;
}

function markAsComplete(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function markAsIncomplete(bookId) {
  const book = findBook(bookId);
  if (book) {
    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

function saveData() {
  if (isStorageExist()) {
    const serialized = JSON.stringify(books);
    localStorage.setItem("BOOKS_DATA", serialized);
    document.dispatchEvent(new Event("BOOKS_SAVED"));
  }
}

const STORAGE_KEY = "BOOKS_DATA";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("BOOKS_SAVED", function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    books.push(...data);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBooks();
});

renderBooks();

function searchBooks() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const searchResults = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  window.searchResults = searchResults;
  renderBooks();
}

function renderBooks() {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompleteBookshelfList.innerHTML = "";

  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  completeBookshelfList.innerHTML = "";

  const displayedBooks = window.searchResults || books;
  for (const book of displayedBooks) {
    const bookItem = makeBookItem(book);
    if (!book.isComplete) {
      incompleteBookshelfList.append(bookItem);
    } else {
      completeBookshelfList.append(bookItem);
    }
  }
}
