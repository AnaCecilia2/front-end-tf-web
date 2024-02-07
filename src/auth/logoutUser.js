function logout() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userData");
  window.location.href = "../../index.html";
}
