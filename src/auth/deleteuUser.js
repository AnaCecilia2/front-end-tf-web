const token = sessionStorage.getItem("accessToken");

const userDataStr = sessionStorage.getItem("userData");
const user = userDataStr ? JSON.parse(userDataStr) : [];
const frUser = user.length > 0 ? user[0] : null;
const iduser = frUser ? frUser.idusuario : null;

var data = {
  userId: iduser,
};

function doDeleteUser() {
  let allAnnouncements;

  fetch(`https://back-end-tf-web2.vercel.app/anuncio/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((announcements) => {
      allAnnouncements = announcements;

      const userAnnouncements = announcements.filter(
        (announcement) => announcement.fk_usuario_id === iduser
      );

      if (userAnnouncements.length > 0) {
        const deleteAnnouncementsPromises = userAnnouncements.map(
          (announcement) => {
            return fetch(
              `https://back-end-tf-web2.vercel.app/anuncio/${announcement.idanuncio}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": token,
                },
                body: JSON.stringify({
                  anuncioId: announcement.idanuncio,
                }),
              }
            );
          }
        );
        return Promise.all(deleteAnnouncementsPromises);
      } else {
        return Promise.resolve();
      }
    })
    .then(() => {
      return fetch(`https://back-end-tf-web2.vercel.app/usuario/${iduser}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(data),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userData");
      window.location.href = "../../index.html";
    })
    .catch((error) => {});
}
