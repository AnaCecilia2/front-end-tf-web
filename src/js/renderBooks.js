let books = [];
const booksPerPage = 12;
let currentPage = 1;

const bookContainer = document.getElementById("bookContainer");

async function fetchBooks() {
  try {
    showSkeletonLoading(16);

    const response = await fetch("https://back-end-tf-web2.vercel.app/anuncio");

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }

    books = await response.json();

    hideSkeletonLoading();
    renderBooks();
  } catch (error) {
    window.location.href = "/src/pages/servcindisponivel.html";
  }
}

function showSkeletonLoading(count) {
  const skeletonHTML = Array.from(
    { length: count },
    (_, index) => `
    <div class="card m-2 shadow skeleton-card" style="width: 18rem; height: 300px; position: relative; overflow: hidden;">
      <div class="card-body" style="position: relative; z-index: 1;">
        <h5 class="card-title text-color" style="width: 70%; height: 20px; background: linear-gradient(90deg, transparent, #f0f0f0, transparent); animation: waveAnimation 1.5s infinite linear;"></h5>
        <p class="card-text" style="width: 50%; height: 16px; margin-top: 10px; background: linear-gradient(90deg, transparent, #f0f0f0, transparent); animation: waveAnimation 1.5s infinite linear;"></p>
        <p class="card-text" style="width: 60%; height: 16px; margin-top: 10px; background: linear-gradient(90deg, transparent, #f0f0f0, transparent); animation: waveAnimation 1.5s infinite linear;"></p>
        <p class="card-text" style="width: 80%; height: 16px; margin-top: 10px; background: linear-gradient(90deg, transparent, #f0f0f0, transparent); animation: waveAnimation 1.5s infinite linear;"></p>
      </div>
    </div>
  `
  ).join("");

  bookContainer.innerHTML = skeletonHTML;
}

function hideSkeletonLoading() {
  bookContainer.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".form-control");
  const form = document.querySelector("form");

  searchInput.addEventListener("input", function () {
    currentPage = 1;
    const searchTerm = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((livro) =>
      livro.nomelivro.toLowerCase().includes(searchTerm)
    );
    renderBooks(filteredBooks);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  fetchBooks();
});

function renderBooks(filteredBooks = books) {
  bookContainer.innerHTML = "";

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksToRender = filteredBooks.slice(startIndex, endIndex);

  booksToRender.forEach((livro) => {
    const livroHTML = document.createElement("div");
    livroHTML.classList.add("card", "m-2", "shadow");
    livroHTML.style.width = "18rem";
    livroHTML.style.minHeight = "19rem";

    const price = livro.preco;
    const numericPrice =
      typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;

    const formatedPrice = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericPrice);

    livroHTML.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-color">${livro.nomelivro}</h5>
        <p class="card-text">Estado de conservação: ${livro.condicaouso}</p>
        <p class="card-text">${formatedPrice}</p>
        <p class="card-text">${livro.descricao}</p>
      </div>
    `;

    livroHTML.addEventListener("click", () => {
      openBookPage(livro.idanuncio);
    });

    livroHTML.classList.add("hoverable");

    bookContainer.appendChild(livroHTML);
  });
}

function openBookPage(bookId) {
  if (bookId !== undefined) {
    window.location.href = `/src/pages/bookDetails.html?id=${bookId}`;
  } else {
    console.error("Book ID is undefined.");
  }
}

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageSpan = document.getElementById("currentPage");

function updatePaginationButtons() {
  const totalPages = Math.ceil(books.length / booksPerPage);
}

prevPageBtn.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderBooks();
    currentPageSpan.textContent = currentPage;
    updatePaginationButtons();
  }
});

nextPageBtn.addEventListener("click", function () {
  const totalPages = Math.ceil(books.length / booksPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderBooks();
    currentPageSpan.textContent = currentPage;
    updatePaginationButtons();
  }
});

updatePaginationButtons();
