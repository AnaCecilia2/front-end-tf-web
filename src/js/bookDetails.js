document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id");

  if (bookId) {
    try {
      const booksResponse = await fetch(
        "https://back-end-tf-web2.vercel.app/anuncio"
      );

      if (!booksResponse.ok) {
        throw new Error(
          `Erro na requisição de livros: ${booksResponse.status} ${booksResponse.statusText}`
        );
      }

      const books = await booksResponse.json();

      const selectedBook = books.find(
        (livro) => livro.idanuncio === parseInt(bookId)
      );

      if (selectedBook) {
        const userResponse = await fetch(
          `https://back-end-tf-web2.vercel.app/usuario/${selectedBook.fk_usuario_id}`
        );
        const userDetailsArray = await userResponse.json();

        if (Array.isArray(userDetailsArray) && userDetailsArray.length > 0) {
          const userDetails = userDetailsArray[0];
          renderBookDetails(selectedBook, userDetails);
        }
      }
    } catch (error) {
      console.error("Erro na requisição de livros:", error.message);
    }
  } else {
    console.error("Book ID not found in the URL.");
  }
});

function renderBookDetails(bookDetails, userDetails) {
  const bookDetailsContainer = document.getElementById("bookProfileContainer");

  const price = bookDetails.preco;
  const numericPrice =
    typeof price === "string" ? parseFloat(price.replace(",", ".")) : price;

  const formatedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericPrice);

  const bookDetailsHTML = document.createElement("div");
  bookDetailsHTML.innerHTML = `
    <div class="card m-2 shadow" style="min-width: 60em; min-height: 45em">
      <div class="card-header text-white text-center fs-2 bg-colortwo">
        ${bookDetails.nomelivro}
      </div>
      <div class="card-body">
        <p class="card-text fs-2 py-3">Estado de conservação: ${bookDetails.condicaouso}</p>
        <p class="card-text fs-2 py-3">Preço: ${formatedPrice}</p>
        <p class="card-text fs-2 py-3">Descrição: ${bookDetails.descricao}</p>
        <p class="card-text fs-2 py-3">Anunciado por: ${userDetails.nome}</p>
        <p class="card-text fs-2 py-3">Contato para troca: ${userDetails.contato}</p>
      </div>
    </div>
  `;

  bookDetailsContainer.appendChild(bookDetailsHTML);
  S;
}
