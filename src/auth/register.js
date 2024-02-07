function doRegister() {
  var name = document.getElementById("inputName").value;
  var email = document.getElementById("exampleInputEmail1").value;
  var password = document.getElementById("exampleInputPassword1").value;
  var contact = document.getElementById("inputTell").value;

  var data = {
    nome: name,
    senha: password,
    email: email,
    contato: contact,
  };

  fetch("https://back-end-tf-web2.vercel.app/usuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      window.location.href = "../pages/login.html";
    })
    .catch((error) => {});
}
