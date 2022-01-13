// window.onload = function () {
//   isLoggedIn();
// };

function isLoggedIn() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged in!");
      //set username and image
      document.getElementById("username").innerHTML = `Hello, Admin!`;
    } else if (xhr.status !== 200) {
      console.log("error login: " + xhr.status);
      window.location.href = "./index.html";
    }
  };
  xhr.open("GET", "Login", true);
  xhr.send();
}

const logout = document.querySelector("#logout");
logout.addEventListener("click", function () {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged out!");
      window.location.href = "./index.html";
    } else if (xhr.status !== 200) {
      console.log("error logout: " + xhr.status);
    }
  };
  xhr.open("GET", "Logout", true);
  xhr.send();
});

let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info = button.getAttribute("data-bs-whatever");
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");

  if (info === "editAllUsers") {
    modalTitle.innerHTML = "Edit All Users";
    modalBody.innerHTML = `
    <div class="container-fluid">
      <div class="row d-flex justify-content-center align-items-center">
        <div class="col-md-9">
          <ul class="list-group list-group-horizontal">
            <li class="list-group-item">Dimitris Kourgiantakis</li>
            <li class="list-group-item">Chania</li>
            <li class="list-group-item">Dimitris Kourgiantakis</li>
            <li class="list-group-item">Chania</li>
          </ul>
        </div>
        <div class="col-md-3">
          <button class="btn btn-dark" onclick="window.location.href='#'">Delete User</button>
        </div>
      </div>
    </div>`;
  } else if (info === "certificateDoctors") {
    modalTitle.innerHTML = "Certificate Doctors";
  }
});
