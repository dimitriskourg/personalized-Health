window.onload = function () {
  isLoggedIn();
};

let FinalDoctor;

function isLoggedIn() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged in!");
      console.log(xhr.responseText);
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

  if (info === "newAppointment") {
    console.log(today());
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

    modalBody.innerHTML += `
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
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="table-warning">Edit</th>
          <td>25-3-2001</td>
          <td>50$</td>
          <td>Na min exei corona</td>
          <td>Nikos Koutroulis</td>
          <td>
          <button type="button" class="btn btn-danger">Cancel</button>
          <button type="button" class="btn btn-success">Done</button>
          </td>
        </tr>
      </tbody>
    </table>
  `;
  } else if (info === "canceledAppointments") {
    modalTitle.innerHTML = "Canceled Appointments";
  } else if (info === "doneAppointments") {
    modalTitle.innerHTML = "Done Appointments";
  }
});
