const userDatajson = sessionStorage.getItem("userData");
const userDat = userDatajson ? JSON.parse(userDatajson) : null;

async function editarConta() {
  const username = $("#editUsername").val();
  const contato = $("#editContato").val();

  const editContaButton = document.querySelector(".btn-editconta");
  const originalButtonText = editContaButton.innerHTML;

  editContaButton.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Aguarde...';
  editContaButton.disabled = true;

  const updatedUserData = {
    nome: username,
    senha: userDat[0].senha,
    email: userDat[0].email,
    contato: contato,
    idusuario: userDat[0].idusuario,
  };

  try {
    const response = await fetch(
      "https://back-end-tf-web2.vercel.app/usuario",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": accessToken,
        },
        body: JSON.stringify(updatedUserData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erro na atualização da conta: ${response.status} ${response.statusText}`
      );
    }
    $("#editAccountModal").modal("hide");

    userDat[0].nome = username;
    userDat[0].contato = contato;

    $("#usernameElement").text(username);
    $("#contatoElement").text(contato);
    window.location.reload();

    sessionStorage.setItem("userData", JSON.stringify(userDat));
  } catch (error) {
  } finally {
    editContaButton.innerHTML = originalButtonText;
    editContaButton.disabled = false;
  }
}
