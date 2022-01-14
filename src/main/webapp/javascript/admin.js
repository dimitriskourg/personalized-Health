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

function deleteUser(username, index) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("User Deleted!");
      document.querySelector(`#${index}`).remove();
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
    }
  };
  const json = '{"username":"' + username + '"}';
  xhr.open("POST", "DeleteUser", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(json);
}

function certifyDoctor(username, index) {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Doctor Certified!");
      document.querySelector(`#${index}`).remove();
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
    }
  };
  const json = '{"username":"' + username + '"}';
  xhr.open("POST", "ApproveDoctors", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(json);
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
    allUsers.users.forEach((element, index) => {
      modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark" id="user${index}" >
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="deleteUser('${element.username}', 'user${index}')">Delete User</button></
      </div>
        `;
    });

    //d-flex justify-content-center align-items-center
    allUsers.doctors.forEach((element, index) => {
      modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark" id="doctor${index}" >
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="deleteUser('${element.username}', 'doctor${index}' )">Delete User</button></
      </div>
      `;
    });

    modalBody.innerHTML += `
    </div>`;
  } else if (info === "certificateDoctors") {
    modalTitle.innerHTML = "Certify Doctors";
    modalBody.innerHTML = `
    <div class="container-fluid">`;
    console.log(allUsers.doctors);
    allUsers.doctors.forEach((element, index) => {
      if (element.certified === 0) {
        modalBody.innerHTML += `
      <div class="row mb-2 p-2 d-flex align-items-center border-bottom border-dark" id="certDoctor${index}" >
            <div class="col-md-4 ">${element.firstname} ${element.lastname}</div>
            <div class="col-md-3 ">${element.username}</div>
            <div class="col-md-2 ">${element.birthdate}</div>
            <div class="col-md-3"><button class="btn btn-dark" onclick="certifyDoctor('${element.username}' , id='certDoctor${index}')">Certify User</button></
      </div>
        `;
      }

      modalBody.innerHTML += `
      </div>`;
    });
  }
});
