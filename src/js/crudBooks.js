const userDataString2 = sessionStorage.getItem("userData");
const userData2 = userDataString2 ? JSON.parse(userDataString2) : [];
const accessToken = sessionStorage.getItem("accessToken");

const firstUser2 = userData2.length > 0 ? userData2[0] : null;
const idUser = firstUser2 ? firstUser2.idusuario : null;

async function inserirAnuncio() {
  const title = document.getElementById("bookTitle").value;
  const cond = document.getElementById("condition").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("description").value;

  const button = document.querySelector(".btn-insert");
  const originalButtonText = button.innerHTML;

  button.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Aguarde...';
  button.disabled = true;

  try {
    if (idUser === null || idUser === undefined) {
      throw new Error("ID do usuário não encontrado.");
    }

    const numericPrice = parseFloat(
      price.replace(/[^\d,]/g, "").replace(",", ".")
    );

    const bookData = {
      nomelivro: title,
      condicaouso: cond,
      preco: numericPrice,
      descricao: desc,
      idautor: idUser,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
      body: JSON.stringify(bookData),
    };

    const response = await fetch(
      "https://back-end-tf-web2.vercel.app/anuncio",
      requestOptions
    );

    if (response.ok) {
      window.location.href = "../../index.html";
    } else {
      console.error(
        `Erro na inserção do livro. Código: ${
          response.status
        }, Mensagem: ${await response.text()}`
      );
    }
  } catch (error) {
    console.error("Erro ao realizar a requisição:", error.message);
  } finally {
    button.innerHTML = originalButtonText;
    button.disabled = false;
  }
}

let tempAdId;

function setAdId(adId) {
  tempAdId = adId;
}

async function deleteBook() {
  const adId = tempAdId;

  if (!adId) {
    return;
  }

  const deleteButton = document.querySelector(".delete-btn");
  const originalButtonText = deleteButton.innerHTML;

  deleteButton.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Aguarde...';
  deleteButton.disabled = true;

  try {
    const response = await fetch(
      `https://back-end-tf-web2.vercel.app/anuncio/${adId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify({
          anuncioId: adId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro na exclusão: ${response.status} ${response.statusText}`
      );
    }

    $("#deleteAdModal").modal("hide");

    if (window.fetchBooks) {
      window.fetchBooks();
    }
  } catch (error) {
    console.error("Erro na exclusão:", error.message);
  } finally {
    deleteButton.innerHTML = originalButtonText;
    deleteButton.disabled = false;
  }
}

async function updateAnuncio() {
  const adId = tempAdId;

  if (!adId) {
    return;
  }

  const updateButton = document.querySelector(".update-btn");
  const originalButtonText = updateButton.innerHTML;

  updateButton.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Aguarde...';
  updateButton.disabled = true;

  const url = "https://back-end-tf-web2.vercel.app/anuncio";

  const titulo = document.getElementById("editBookTitle").value;
  const estadoConservacao = document.getElementById("editBookCondition").value;
  const preco = document.getElementById("editBookPrice").value;
  const descricao = document.getElementById("editBookDescription").value;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
      body: JSON.stringify({
        nomelivro: titulo,
        condicaouso: estadoConservacao,
        preco: preco,
        descricao: descricao,
        idanuncio: adId,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Erro na requisição: ${response.status} ${response.statusText}`
      );
    }
    $("#editBookModal").modal("hide");
    if (window.fetchBooks) {
      window.fetchBooks();
    }
  } catch (error) {
  } finally {
    updateButton.innerHTML = originalButtonText;
    updateButton.disabled = false;
  }
}

function recuperarInfos() {
  const id = tempAdId;
  const loadBookDataPromise = new Promise((resolve, reject) => {
    const selectedBook = books.find((livro) => livro.idanuncio === id);
    if (selectedBook) {
      $("#editBookTitle").val(selectedBook.nomelivro || "");
      $("#editBookCondition").val(selectedBook.condicaouso || "");
      $("#editBookPrice").val(selectedBook.preco || "");
      $("#editBookDescription").val(selectedBook.descricao || "");
      resolve(selectedBook);
    } else {
      reject("Livro não encontrado");
    }
  });

  loadBookDataPromise.then(() => {
    $("#editBookModal").modal("show");
  });
}
