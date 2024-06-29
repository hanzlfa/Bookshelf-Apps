const myLibrary = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const SAVED_EVENT = "saved-data";

function generatedId() {
  return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(myLibrary);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function loadDataFromStorage() {
  const saveData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(saveData);

  if (data !== null) {
    for (const book of data) {
      myLibrary.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createBookElement(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;
  bookItem.appendChild(bookTitle);

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${book.author}`;
  bookItem.appendChild(bookAuthor);

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${book.year}`;
  bookItem.appendChild(bookYear);

  const actionDiv = document.createElement("div");
  actionDiv.classList.add("action");

  const completeButton = document.createElement("button");
  completeButton.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  completeButton.addEventListener("click", function () {
    book.isComplete = !book.isComplete;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    const bookIndex = myLibrary.findIndex((b) => b.id === book.id);
    if (bookIndex !== -1) {
        myLibrary.splice(bookIndex, 1);
        saveData();
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", function () {
    alert("Fungsi edit belum diimplementasikan.");
  });

  actionDiv.appendChild(completeButton);
  actionDiv.appendChild(deleteButton);
  actionDiv.appendChild(editButton);

  bookItem.appendChild(actionDiv);

  return bookItem;
}

function addBookToLibrary() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const id = generatedId();
  const book = createBookObject(id, title, author, year, isComplete);
  myLibrary.push(book);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  searchBooks(document.getElementById('searchBookTitle').value.toLowerCase());
  console.log(book);
}

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("bookForm");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBookToLibrary();
    bookForm.reset();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.getElementById('searchBookTitle').addEventListener ('input', function(event) {
    const searchTitle = event.target.value.toLowerCase();
    searchBooks(searchTitle);
});

function searchBooks(searchTitle) {
    const incompleteBookList = document.getElementById("incompleteBookList");
    incompleteBookList.innerHTML = "";
    const completeBookList = document.getElementById("completeBookList");
    completeBookList.innerHTML = "";

    for (const book of myLibrary) {
        if (book.title.toLowerCase().includes(searchTitle) || book.author.toLowerCase().includes(searchTitle)) {
            const bookElement = createBookElement(book);
            if (!book.isComplete) {
                incompleteBookList.append(bookElement);
            } else {
                completeBookList.append(bookElement);
            }
        }
    }
}
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  
document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById("incompleteBookList");
  incompleteBookList.innerHTML = "";
  const completeBookList = document.getElementById("completeBookList");
  completeBookList.innerHTML = "";

  for (const book of myLibrary) {
    const bookElement = createBookElement(book);
    if (!book.isComplete) {
      incompleteBookList.append(bookElement);
    } else {
      completeBookList.append(bookElement);
    }
  }
    searchBooks(document.getElementById('searchBookTitle').value.toLowerCase());
});