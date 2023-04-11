document.addEventListener("DOMContentLoaded", function() {
    const BOOKS_URL = "http://localhost:3000/books";
const bookList = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

let allBooks = [];

// Fetch the list of books from the server and display them
function getBooks() {
  fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(books => {
      allBooks = books;
      renderBooks(allBooks);
    })
    .catch(error => console.error(error));
}

// Render a list of books as li elements
function renderBooks(books) {
  bookList.innerHTML = "";
  books.forEach(book => {
    const bookLi = document.createElement("li");
    bookLi.textContent = book.title;
    bookList.appendChild(bookLi);

    // Add event listener to display book details when title is clicked
    bookLi.addEventListener("click", event => {
      event.preventDefault();
      showBookDetails(book);
    });
  });
}

// Display the details of a single book
function showBookDetails(book) {
  showPanel.innerHTML = `
    <img src="${book.img_url}">
    <h2>${book.title}</h2>
    <h3>${book.subtitle}</h3>
    <p>${book.description}</p>
    <button id="like-button">Like</button>
    <ul>${book.users.map(user => `<li>${user.username}</li>`).join("")}</ul>
  `;

  const likeButton = showPanel.querySelector("#like-button");

  // Add event listener to like button
  likeButton.addEventListener("click", event => {
    event.preventDefault();
    const currentUser = {"id":1, "username":"pouros"};
    if (book.users.find(user => user.id === currentUser.id)) {
      // Remove user from list of users who liked the book
      const updatedUsers = book.users.filter(user => user.id !== currentUser.id);
      updateBookLikes(book, updatedUsers);
      showPanel.querySelector("ul").innerHTML = updatedUsers.map(user => `<li>${user.username}</li>`).join("");
    } else {
      // Add user to list of users who liked the book
      const updatedUsers = [...book.users, currentUser];
      updateBookLikes(book, updatedUsers);
      showPanel.querySelector("ul").innerHTML += `<li>${currentUser.username}</li>`;
    }
  });
}

// Update the list of users who liked a book by sending a PATCH request to the server
function updateBookLikes(book, updatedUsers) {
  fetch(`${BOOKS_URL}/${book.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({users: updatedUsers})
  })
    .then(resp => resp.json())
    .then(updatedBook => {
      const index = allBooks.findIndex(book => book.id === updatedBook.id);
      allBooks[index] = updatedBook;
    })
    .catch(error => console.error(error));
}

// Initialize the application
getBooks();

});
