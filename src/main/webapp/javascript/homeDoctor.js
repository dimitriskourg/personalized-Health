window.onload = function () {
  isLoggedIn();
};

let FinalDoctor;

function isLoggedIn() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged in!");
      let doctor = JSON.parse(xhr.responseText);
      FinalDoctor = doctor;
      console.log(FinalDoctor);
      document.getElementById(
        "username"
      ).innerHTML = `Hello, ${doctor.username}`;
    } else if (xhr.status !== 200) {
      console.log("error login: " + xhr.status);
      window.location.href = "./indexDoctors.html";
    }
  };
  xhr.open("GET", "LoginDoctor", true);
  xhr.send();
}

const logout = document.querySelector("#logout");
logout.addEventListener("click", function () {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged out!");
      window.location.href = "./indexDoctors.html";
    } else if (xhr.status !== 200) {
      console.log("error logout: " + xhr.status);
    }
  };
  xhr.open("GET", "Logout", true);
  xhr.send();
});

//to set today for datetime-local
function today() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  let hh = today.getHours(); // => 9
  let min = today.getMinutes(); // =>  30

  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (min < 10) {
    min = "0" + min;
  }
  today = yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + min;
  return today;
}

//here is a function that opens the modal widget
let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info = button.getAttribute("data-bs-whatever");
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");

  let appointments;
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      appointments = JSON.parse(xhr.responseText);
      console.log(appointments);
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
    }
  };
  const json = '{"id":"' + FinalDoctor.doctor_id + '"}';
  console.log(json);
  xhr.open("POST", "GetRantevouz", false);
  xhr.send(json);

  if (info === "newAppointment") {
    modalTitle.innerHTML = "New Appointment";
    modalBody.innerHTML = `
    <form id="newAppointment" class="container mb-5">
      <h3 class="text-center">New Appointment</h3>
      <div class="row">
        <div class="col-md-2">
          <div class="form-floating mb-3 col=4">
            <input type="number" class="form-control" id="price" placeholder="50€">
            <label for="price">Price</label>
          </div>
        </div>
        <div class="col-md-6 d-flex align-items-center mb-2">
          <input type="datetime-local" id="meeting-time" style="height:70%" min="${today()}" value="${today()}">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-5 mb-2">
          <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100%"></textarea>
            <label for="floatingTextarea2">Comments</label>
          </div>
        </div>
        <div class="col-md-1 d-flex align-items-center">
        <input
          type="submit"
          value="Add New Appointment"
          class="btn btn-dark"
          id="addNewAppointment"
          mx-auto
        />
        </div>
      </div>
    </form>`;
    let body = `
    <table class="table caption-top table-hover table-striped">
      <caption>All Appointments</caption>
      <thead>
        <tr>
          <th scope="col">Status</th>
          <th scope="col">Date</th>
          <th scope="col">Price</th>
          <th scope="col">Doctor Info</th>
          <th scope="col">User Info</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>`;
    appointments.selected.forEach((appointment) => {
      body += `
          <tr>
            <th scope="row" class="table-warning">Selected</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
            <td>
            <button type="button" class="btn btn-danger">Cancel</button>
            <button type="button" class="btn btn-success">Done</button>
            </td>
          </tr>`;
    });

    appointments.free.forEach((appointment) => {
      body += `
          <tr>
            <th scope="row" class="table-info">Available</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
            <td>
            <button type="button" class="btn btn-danger">Cancel</button>
            <button type="button" class="btn btn-success">Done</button>
            </td>
          </tr>`;
    });

    body += `</tbody>
      </table>`;
    modalBody.innerHTML += body;
  } else if (info === "cancelledAppointments") {
    modalTitle.innerHTML = "Cancelled Appointments";
    modalBody.innerHTML = ``;
    let cancelled = `<table class="table caption-top table-hover table-striped">
    <caption>Cancelled Appointments</caption>
    <thead>
      <tr>
        <th scope="col">Status</th>
        <th scope="col">Date</th>
        <th scope="col">Price</th>
        <th scope="col">Doctor Info</th>
        <th scope="col">User Info</th>
      </tr>
    </thead>`;
    appointments.cancelled.forEach((appointment) => {
      cancelled += `
          <tr>
            <th scope="row" class="table-danger">Cancelled</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
          </tr>`;
    });
    cancelled += `</tbody>
      </table>`;
    modalBody.innerHTML += cancelled;
  } else if (info === "doneAppointments") {
    modalBody.innerHTML = ``;
    modalTitle.innerHTML = "Done Appointments";
    let done = `<table class="table caption-top table-hover table-striped">
    <caption>Done Appointments</caption>
    <thead>
      <tr>
        <th scope="col">Status</th>
        <th scope="col">Date</th>
        <th scope="col">Price</th>
        <th scope="col">Doctor Info</th>
        <th scope="col">User Info</th>
        <th scope="col">History</th>
      </tr>
    </thead>`;
    appointments.cancelled.forEach((appointment) => {
      done += `
          <tr>
            <th scope="row" class="table-success">Done</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
            <td>
            <button type="button" class="btn btn-info">Show History</button>
            </td>
          </tr>`;
    });
    done += `</tbody>
      </table>`;
    modalBody.innerHTML += done;
  }
});
