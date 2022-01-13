const alert = document.querySelector("#alert-error");

function ErrorLoggin(mess) {
  alert.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="danger">
  ${mess}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

function Login() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("success login");
      console.log(xhr.responseText);
      if (JSON.parse(xhr.responseText).success === "admin") {
        window.location.href = "./admin.html";
      } else {
        window.location.href = "./home.html";
      }
    } else if (xhr.status !== 200) {
      const response = JSON.parse(xhr.responseText);
      console.log("error login: " + xhr.status);
      ErrorLoggin(response.error);
    }
  };

  const myForm = document.getElementById("loginForm");
  let formData = new FormData(myForm);
  let data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });
  let json = JSON.stringify(data);
  xhr.open("POST", "Login", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(json);
}

window.onload = function () {
  isLoggedIn();
};

function isLoggedIn() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("success login");
      window.location.href = "./home.html";
    } else if (xhr.status !== 200) {
      console.log("error login: " + xhr.status);
    }
  };
  xhr.open("GET", "Login", true);
  xhr.send();
}
