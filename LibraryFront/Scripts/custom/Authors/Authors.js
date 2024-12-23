var apiAuthorsUrl = "http://localhost:50148/api/Authors";

    // DOM Elements
    var addAuthorBtn = document.getElementById("add-author-btn");
    var authorModal = document.getElementById("author-modal");
    var closeAuthorModalBtn = document.getElementById("close-author-modal");
    var authorForm = document.getElementById("author-form");
    var authorsTableBody = document.getElementById("authors-table").querySelector("tbody");

    // Fetch Authors
    async function fetchAuthors() {
        try {
            const response = await fetch(apiAuthorsUrl);
            if (!response.ok) throw new Error("Error al obtener autores.");
            const authors = await response.json();
            renderAuthors(authors);
        } catch (error) {
            console.error("Error al cargar autores:", error);
        }
    }

    // Render Authors
    function renderAuthors(authors) {
        authorsTableBody.innerHTML = "";
        authors.forEach((author) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${author.id}</td>
            <td>${author.fullName}</td>
            <td>${author.birthCity}</td>
            <td>${new Date(author.birthday).toLocaleDateString()}</td>
            <td>${author.email}</td>
            <td>
                <button class="edit-btn btn btn-primary" data-id="${author.id}">Editar</button>
                <button class="delete-btn btn btn-danger" data-id="${author.id}">Eliminar</button>
            </td>
        `;
            authorsTableBody.appendChild(row);
        });
    }

    // Add or Edit Author
    async function saveAuthor(event) {
        event.preventDefault();

        const author = {
            id: document.getElementById("author-id").value || null,
            fullNameDTO: document.getElementById("full-name").value,
            birthCityDTO: document.getElementById("birthCity").value,
            birthdayDTO: document.getElementById("birthday").value,
            emailDTO: document.getElementById("email").value,
        };

        try {
            const method = author.id ? "PUT" : "POST";
            const url = author.id ? `${apiAuthorsUrl}/${author.id}` : apiAuthorsUrl;

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(author),
            });

            if (!response.ok) throw new Error("Error al guardar autor.");
            console.log("Autor guardado correctamente");
            closeAuthorModal();
            fetchAuthors();
        } catch (error) {
            console.error("Error al guardar autor:", error);
        }
    }

    // Delete Author
    async function deleteAuthor(id) {
        if (!confirm("¿Estás seguro de eliminar este autor?")) return;

        try {
            const response = await fetch(`${apiAuthorsUrl}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error al eliminar autor.");
            fetchAuthors();
        } catch (error) {
            console.error("Error al eliminar autor:", error);
        }
    }

    // Modal Controls
    function openAuthorModal(author = null) {
        document.getElementById("modal-title").textContent = author ? "Editar Autor" : "Agregar Autor";
        document.getElementById("author-id").value = author?.id || "";
        document.getElementById("full-name").value = author?.fullName || "";
        document.getElementById("birthCity").value = author?.birthCity || "";
        document.getElementById("birthday").value = author?.birthday || "";
        document.getElementById("email").value = author?.email || "";
        authorModal.style.display = "flex";
    }

    function closeAuthorModal() {
        authorModal.style.display = "none";
    }

    // Event Listeners
    addAuthorBtn.addEventListener("click", () => openAuthorModal());
    closeAuthorModalBtn.addEventListener("click", closeAuthorModal);
    authorForm.addEventListener("submit", saveAuthor);

    authorsTableBody.addEventListener("click", (event) => {
        if (event.target.classList.contains("edit-btn")) {
            const authorId = event.target.dataset.id;
            const row = event.target.closest("tr");
            const author = {
                id: authorId,
                fullName: row.children[1].textContent,
                birthCity: row.children[2].textContent,
                birthday: row.children[3].textContent,
                email: row.children[4].textContent,
            };
            openAuthorModal(author);
        } else if (event.target.classList.contains("delete-btn")) {
            const authorId = event.target.dataset.id;
            deleteAuthor(authorId);
        }
    });

    // Close modal on outside click
    window.addEventListener("click", (event) => {
        if (event.target === authorModal) {
            closeAuthorModal();
        }
    });

    // Initial Load
    fetchAuthors();


