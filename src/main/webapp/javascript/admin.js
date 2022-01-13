window.onload = function () {
  isLoggedIn();
};

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

function deleteUser(username) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("User Deleted!");
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
    }
  };
  const json = '{"username":"' + username + '"}';
  console.log(json);
  xhr.open("POST", "DeleteUser", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(json);
}

function certifyDoctor(username) {
  console.log("MPHKES");
}

let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info = button.getAttribute("data-bs-whatever");
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");

  let allUsers;
  //take all users
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      allUsers = JSON.parse(xhr.responseText);
    } else if (xhr.status !== 200) {
      console.log("error in data: " + xhr.status);
    }
  };
  xhr.open("POST", "AdminFields", false);
  xhr.send();
  console.log(allUsers);

  if (info === "editAllUsers") {
    modalTitle.innerHTML = "Edit All Users";
    modalBody.innerHTML = `
    <div class="container-fluid">`;
    allUsers.users.forEach((element) => {
      modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark">
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="deleteUser('${element.username}')">Delete User</button></
      </div>
        `;
    });

    //d-flex justify-content-center align-items-center
    allUsers.doctors.forEach((element) => {
      modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark">
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="deleteUser('${element.username}')">Delete User</button></
      </div>
      `;
    });

    modalBody.innerHTML += `
    </div>`;
  } else if (info === "certificateDoctors") {
    modalTitle.innerHTML = "Certify Doctors";
    modalBody.innerHTML = `
    <div class="container-fluid">`;
    allUsers.doctors.forEach((element) => {
      if (element.certified === false) {
        modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark">
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="certifyDoctor('${element.username}')">Certify User</button></
      </div>
        `;
      }
    });
  }
});
