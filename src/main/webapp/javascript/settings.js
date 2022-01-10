const alert = document.querySelector("#alert-error");

function ErrorLoggin(mess) {
  alert.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="danger">
  ${mess}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

function SuccessLoggin(mess) {
  alert.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="danger">
  ${mess}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

//check for password missmatch
const password = document.querySelector("#password1");
const password2 = document.querySelector("#password2");

function updateSettings() {
  if (password2.value !== password.value) {
    ErrorLoggin("Passwords do not match");
    return;
  }
  //check for email missmatch
  const email = document.querySelector("#email");
  if (email.value !== FinalUser.email) {
    //make email a json object
    const emailJson = {
      type: "email",
      info: email.value,
    };
    let data11 = JSON.stringify(emailJson);
    //send the json object to the server
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200) {
        if (xhr.status === 403) {
          const response = JSON.parse(xhr.responseText);
          ErrorLoggin(response.error);
          return;
        } else {
          console.log("error");
          return;
        }
      }
    };
    xhr.open("POST", "CheckFirstParams", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data11);
  }

  //send updated settings to the server
  let myForm = document.querySelector("#upd");
  let formData = new FormData(myForm);
  let data2 = {};
  formData.forEach(function (value, key) {
    data2[key] = value;
  });
  let json = JSON.stringify(data2);

  const xhr2 = new XMLHttpRequest();
  xhr2.onload = function () {
    if (xhr2.status === 200) {
      const response = JSON.parse(xhr2.responseText);
      SuccessLoggin(response.success);
    } else {
      if (xhr2.status === 403) {
        const response = JSON.parse(xhr2.responseText);
        ErrorLoggin(response.error);
        return;
      } else {
        console.log("error");
        return;
      }
    }
  };
  xhr2.open("POST", "UpdateSettings", true);
  xhr2.setRequestHeader("Content-type", "application/json");
  xhr2.send(json);
}
