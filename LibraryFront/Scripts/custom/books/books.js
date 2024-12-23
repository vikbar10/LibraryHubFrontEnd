
var apiBooksUrl = "http://localhost:50148/api/Books";

// DOM Elements
var addBookBtn = document.getElementById("add-book-btn");
var bookModal = document.getElementById("book-modal");
var closeBookModalBtn = document.getElementById("close-book-modal");
var bookForm = document.getElementById("book-form");
var booksTableBody = document.getElementById("books-table").querySelector("tbody");
var authorSelect = document.getElementById("author-id");

// Fetch Books
async function fetchBooks() {
    try {
        const response = await fetch(apiBooksUrl);
        if (!response.ok) throw new Error("Error al obtener libros.");
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error("Error al cargar libros:", error);
    }
}

// Fetch Authors for Dropdown
async function fetchAuthorsForDropdown() {
    try {
        const response = await fetch(apiAuthorsUrl);
        if (!response.ok) throw new Error("Error al obtener autores.");
        const authors = await response.json();
        populateAuthorsDropdown(authors);
    } catch (error) {
        console.error("Error al cargar autores:", error);
    }
}

// Populate Authors Dropdown
function populateAuthorsDropdown(authors) {
    authorSelect.innerHTML = "";
    authors.forEach((author) => {
        const option = document.createElement("option");
        option.value = author.id;
        option.textContent = author.fullName;
        authorSelect.appendChild(option);
    });
}

// Render Books
function renderBooks(books) {
    booksTableBody.innerHTML = "";
    books.forEach((book) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.releaseYear}</td>
            <td>${book.bookGenre}</td>
            <td>${book.pagesCount}</td>
            <td>${book.author.fullName}</td>
            <td>
                <button class="edit-btn" data-id="${book.id}">Editar</button>
                <button class="delete-btn" data-id="${book.id}">Eliminar</button>
            </td>
        `;
        booksTableBody.appendChild(row);
    });
}

// Add or Edit Book
async function saveBook(event) {
    event.preventDefault();

    const book = {
        id: document.getElementById("book-id").value || null,
        titleDTO: document.getElementById("title").value,
        releaseYearDTO: document.getElementById("release-year").value,
        bookGenreDTO: document.getElementById("genre").value,
        pagesCountDTO: document.getElementById("pages").value,
        idAuthorDTO: document.getElementById("author-id").value,
    };

    try {
        const method = book.id ? "POST" : "PUT";
        //const url = book.id ? `${apiBooksUrl}/${book.id}` : apiBooksUrl;
        const url = method === "PUT" ? `${apiBooksUrl}/${bookId}` : apiBooksUrl;

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book),
        });

        if (!response.ok)
        {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.message || "Error desconocido del servidor.";
            alert(errorMessage); 
            return; 
        }
        closeBookModal();
        fetchBooks();
    } catch (error) {
        console.error("Error al guardar libro:", error);
    }
}

// Delete Book
async function deleteBook(id) {
    if (!confirm("¿Estás seguro de eliminar este libro?")) return;

    try {
        const response = await fetch(`${apiBooksUrl}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar libro.");
        fetchBooks();
    } catch (error) {
        console.error("Error al eliminar libro:", error);
    }
}

// Modal Controls
function openBookModal(book = null) {
    document.getElementById("book-modal-title").textContent = book ? "Editar Libro" : "Agregar Libro";
    document.getElementById("book-id").value = book?.id || "";
    document.getElementById("title").value = book?.title || "";
    document.getElementById("release-year").value = book?.releaseYear || "";
    document.getElementById("genre").value = book?.bookGenre || "";
    document.getElementById("pages").value = book?.pagesCount || "";
    document.getElementById("author-id").value = book?.idAuthor || "";

    originalAuthorId = book?.idAuthorDTO || null;

    bookModal.style.display = "flex";
}

function closeBookModal() {
    bookModal.style.display = "none";
}

// Event Listeners
addBookBtn.addEventListener("click", () => openBookModal());
closeBookModalBtn.addEventListener("click", closeBookModal);
bookForm.addEventListener("submit", saveBook);

booksTableBody.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-btn")) {
        const bookId = event.target.dataset.id;
        const row = event.target.closest("tr");
        const book = {
            id: bookId,
            title: row.children[1].textContent,
            releaseYear: row.children[2].textContent,
            bookGenre: row.children[3].textContent,
            pagesCount: row.children[4].textContent,
            authorName: row.children[5].textContent,
        };
        openBookModal(book);
    } else if (event.target.classList.contains("delete-btn")) {
        const bookId = event.target.dataset.id;
        deleteBook(bookId);
    }
});

// Close modal on outside click
window.addEventListener("click", (event) => {
    if (event.target === bookModal) {
        closeBookModal();
    }
});

// Initial Load
fetchBooks();
fetchAuthorsForDropdown();
