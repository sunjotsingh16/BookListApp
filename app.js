
////// Model //////
// Book class -> Represents Book
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


 ////// Front End //////
// UI class -> Handle UI tasks
class UI {
    static displayBooks(){

        const books = Store.getBooks();

        // Loop through all the books
        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book){
        // Create row for a book with tr & td and append it to book-list

        const list = document.querySelector("#book-list");

        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</<td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);

    }

    static clearFields(){
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
    
    static deleteBook(e){
        if (e.target.classList.contains("delete")){
            // console.log("Delete Clicked");
            e.target.parentElement.parentElement.remove();
            
        }
    }

    static showAlert(msg, type){
        // Create Alert
        const createAlert = document.createElement("div");
        createAlert.className = `text-center alert alert-${type}`;
        createAlert.appendChild(document.createTextNode(msg));

        // Add it to the container div before the form
        const container = document.querySelector(".container");
        const formDiv = document.querySelector("#book-form");

        container.insertBefore(createAlert, formDiv);

        // Make the alert disappear after a few seconds. Ex: 3 seconds
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
}

////// Back End //////
// Store Class -> Handles Storage (localStorage)
class Store {
    static getBooks(){
        let books;

        if (localStorage.getItem("books") === null){
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem("books"));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }

}


// Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);


// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents default submit action

    // Get Form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate values
    if (title === "" || author === "" || isbn === ""){
        UI.showAlert("Please fill all the fields", "danger");
    }

    else {
    const book = new Book(title, author, isbn);

    // Add book to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBook(book);

    // Show Alert Message that the addition was successful
    UI.showAlert("!! Book Added !!", "success");

    // Clear fields after adding new book
    UI.clearFields();
}
});

// Event: Remove a book
document.querySelector("#book-list").addEventListener("click", (e) => {
    UI.deleteBook(e);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Show Alert Message that the deletion was successful
    UI.showAlert("!! Book Deleted !!", "success");
})