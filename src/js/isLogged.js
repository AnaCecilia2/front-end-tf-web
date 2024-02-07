document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("accessToken");
  const userDataString = sessionStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const linkLoginId = "linkLogin";
  const linkRegisterId = "linkRegister";
  const linkUsernameId = "linkUsername";
  const linkCreate = "linkCreate";
  const userProfile = "userProfile";

  const toggleLinkVisibility = (elementId, show) => {
    const linkElement = document.getElementById(elementId);
    if (linkElement) {
      linkElement.style.display = show ? "block" : "none";
    }
  };

  if (!token) {
    toggleLinkVisibility(linkLoginId, true);
    toggleLinkVisibility(linkRegisterId, true);
    toggleLinkVisibility(linkUsernameId, false);
    toggleLinkVisibility(linkCreate, false);
    toggleLinkVisibility(userProfile, false);
  } else {
    toggleLinkVisibility(linkLoginId, false);
    toggleLinkVisibility(linkRegisterId, false);
    toggleLinkVisibility(linkUsernameId, true);
    toggleLinkVisibility(linkCreate, true);
    toggleLinkVisibility(userProfile, true);

    const linkUsernameElement = document.getElementById(linkUsernameId);
    if (linkUsernameElement && userData && userData.length > 0) {
      linkUsernameElement.textContent = userData[0].nome;
    }
  }
});
