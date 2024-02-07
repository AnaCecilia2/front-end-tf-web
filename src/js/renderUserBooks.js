let books = [];
const booksPerPage = 8;
let currentPage = 1;

const userDataString = sessionStorage.getItem("userData");
const userData = userDataString ? JSON.parse(userDataString) : [];
const firstUser = userData.length > 0 ? userData[0] : null;
const userId = firstUser ? firstUser.idusuario : null;

function loadAccountData() {
  document.getElementById("editUsername").value = userData[0].nome;
  document.getElementById("editEmail").value = userData[0].email;
  document.getElementById("editContato").value = userData[0].contato;
}

$("#editAccountModal").on("show.bs.modal", function (event) {
  loadAccountData();
});

const bookContainer = document.getElementById("bookContainer");

async function fetchBooks() {
  try {
    showSkeletonLoading(8);

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
    console.error("Erro na requisição:", error.message);
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

const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const currentPageSpan = document.getElementById("currentPage");

function updatePaginationButtons() {
  const totalPages = Math.ceil(books.length / booksPerPage);

  prevPageBtn.disabled = currentPage === 1 || totalPages <= 1;
  nextPageBtn.disabled = currentPage === totalPages || totalPages <= 1;
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

function renderBooks() {
  bookContainer.innerHTML = "";

  const userBooks = books.filter((livro) => livro.fk_usuario_id === userId);

  if (userBooks.length === 0) {
    const noBooksMessage = document.createElement("div");
    noBooksMessage.classList.add(
      "mt-3",
      "d-flex",
      "text-center",
      "justify-content-center",
      "align-items-center",
      "text-light",
      "fs-1",
      "opacity-25"
    );

    noBooksMessage.style.width = "75em";
    noBooksMessage.style.height = "15em";

    noBooksMessage.innerHTML = "Você não possui anúncios ainda.";
    bookContainer.appendChild(noBooksMessage);
  } else {
    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const booksToRender = userBooks.slice(startIndex, endIndex);

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
        <div class="d-flex justify-content-between">
          <div>
            <div class="d-flex justify-content-between">
              <h5 class="card-title text-color">${livro.nomelivro}</h5>
              <div class="d-flex">
                <button class="btn btn-danger btn-sm me-1" style="height: 30px" data-bs-toggle="modal" data-bs-target="#deleteAdModal" onclick="setAdId(${livro.idanuncio})"
                data-bs-target="#deleteAnuncioModal">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                  </svg>
                </button>
                <button class="btn btn-primary btn-sm" style="height: 30px" data-bs-toggle="modal" data-bs-target="#editBookModal" onclick="setAdId(${livro.idanuncio}); recuperarInfos()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                  </svg>
                </button>
              </div>
            </div>
            <p class="card-text">Estado de conservação: ${livro.condicaouso}</p>
            <p class="card-text">Preço: ${formatedPrice}</p>
            <p class="card-text">${livro.descricao}</p>
          </div>
          
        </div>
      </div>
    `;

      livroHTML.classList.add("hoverable");
      bookContainer.appendChild(livroHTML);
    });

    updatePaginationButtons();
  }
}

updatePaginationButtons();
fetchBooks();

const usernameElement = document.getElementById("username");
const contatoElement = document.getElementById("contato");

usernameElement.innerHTML = userData[0].nome;
contatoElement.innerHTML = userData[0].contato;
