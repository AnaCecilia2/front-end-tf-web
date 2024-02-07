function doLogin() {
  document.getElementById("spinner").style.display = "inline-block";
  document.getElementById("loginButton").disabled = true;
  document.getElementById("loginText").innerText = "";

  var email = document.getElementById("InputLoginEmail").value;
  var password = document.getElementById("InputLoginPassword").value;

  var data = {
    senha: password,
    email: email,
  };

  fetch("https://back-end-tf-web2.vercel.app/login", {
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
    .then((data) => {
      if (data.token) {
        sessionStorage.setItem("accessToken", data.token);

        fetch(`https://back-end-tf-web2.vercel.app/usuario/email/${email}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then((userData) => {
            sessionStorage.setItem("userData", JSON.stringify(userData));

            window.location.href = "../../index.html";
          })
          .catch((error) => {});
      } else {
        document.getElementById("errorMessage").style.display = "block";
        document.getElementById("errorMessage").innerText =
          "Credenciais inválidas. Por favor, verifique seu email e senha.";
      }
    })
    .catch((error) => {
      document.getElementById("errorMessage").style.display = "block";
      document.getElementById("errorMessage").innerText =
        "Erro ao fazer login. Por favor, tente novamente.";
    })
    .finally(() => {
      document.getElementById("spinner").style.display = "none";
      document.getElementById("loginButton").disabled = false;
      document.getElementById("loginText").innerText = "Login";
    });
}
