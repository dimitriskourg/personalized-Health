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
  let min = 0;
  hh += 1;

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

function addNewApp() {
  let json = {};
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Appointment Added!");
      document.querySelector("#price").value = "";
      document.querySelector("#floatingTextarea2").value = "";
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="danger">
      Appointment Added!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
      //add the appointment to the table of free appointments
      let appList = document.querySelector("#allAppointments");
      //create a new element for the new appointment
      const newTR = document.createElement("tr");
      newTR.setAttribute("id", `appFree-${Date.now()}`);
      newTR.innerHTML = `
      <th scope="row" class="table-info">Available</th>
            <td>${json.date_time}</td>
            <td>${json.price}€</td>
            <td>${json.info}</td>
            <td></td>
            <td>
            <button type="button" class="btn btn-danger">Cancel</button>
            <button type="button" class="btn btn-success">Done</button>
            </td>
          </tr>`;
      appList.appendChild(newTR);
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
      console.log(xhr.responseText);
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="danger">
      Error: ${JSON.parse(xhr.responseText).error}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }
  };
  const myForm = document.querySelector("#newAppointment");
  let formData = new FormData(myForm);
  formData.forEach((value, key) => {
    json[key] = value;
  });
  json["id"] = FinalDoctor.doctor_id;
  console.log(json);
  xhr.open("POST", "CreateRandevouz", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));
}

function updateRandevouz(action, id) {
  let json = { action: action, id: id };
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Randevouz Updated!");
      document.querySelector(`#app-${id}`).remove();
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="danger">
      Randevouz Updated!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    } else if (xhr.status !== 200) {
      console.log("error: " + xhr.status);
      console.log(xhr.responseText);
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="danger">
      ${JSON.parse(xhr.responseText).error}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }
  };
  xhr.open("POST", "UpdateRandevouz", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));
}

//history charts
google.charts.load("current", { packages: ["line"] });
google.charts.setOnLoadCallback(drawChart);

// window.addEventListener("resize", function () {
//   "use strict";
//   google.charts.load("current", { packages: ["line"] });
//   google.charts.setOnLoadCallback(drawChart);
// });

function drawChart(tests) {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Date");
  data.addColumn("number", "Cholesterol");
  data.addColumn("number", "Blood Sugar");
  data.addColumn("number", "Iron");
  data.addColumn("number", "Vitamin B12");
  data.addColumn("number", "Vitamin d3");

  tests.forEach((test) => {
    data.addRow([
      test.test_date,
      test.cholesterol,
      test.blood_sugar,
      test.iron,
      test.vitamin_b12,
      test.vitamin_d3,
    ]);
  });

  var options = {
    chart: {
      title: "Comparison of Blood Tests",
    },
    width: "100%",
    height: 400,
  };

  var chart = new google.charts.Line(document.getElementById("showCharts"));
  chart.draw(data, google.charts.Line.convertOptions(options));
}

function openHistory(userid) {
  let myCollapse = document.getElementById("collapseMain");
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false,
  });
  //get all bloodtests
  let json = { user_id: userid };
  let tests;
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      tests = JSON.parse(xhr.responseText);
      console.log(tests);
    } else {
      console.log("error: " + xhr.status);
      console.log(xhr.responseText);
    }
  };
  xhr.open("POST", "UserBloodtest", false);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));

  myCollapse.innerHTML = `
  <div class="card">
    <div class="card-header" id="headingOne">
    History
    </div>
    <div class="card-body">
      <br>
      <div id="showCharts"></div>
      <br>
      <button type="button" class="btn btn-info btn-lg my-2" data-bs-toggle="collapse" data-bs-target="#collapseMain">Close</button>
    </div>
  </div>`;
  bsCollapse.show();
  drawChart(tests);
}

//here is a function that opens the modal widget
let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info;
  try {
    info = button.getAttribute("data-bs-whatever");
  } catch (error) {
    console.log(error);
    info = "history";
  }
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");

  let appointments;
  if (info !== "history") {
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
  }

  if (info === "newAppointment") {
    modalTitle.innerHTML = "New Appointment";
    modalBody.innerHTML = `
    <form id="newAppointment" class="container mb-5"
    onsubmit="addNewApp(); return false;">
      <h3 class="text-center">New Appointment</h3>
      <div class="row">
        <div class="col-md-2">
          <div class="form-floating mb-3 col=4">
            <input type="number" class="form-control" id="price" name="price" required>
            <label for="price">Price</label>
          </div>
        </div>
        <div class="col-md-6 d-flex align-items-center mb-2">
          <input type="datetime-local" id="meeting-time" style="height:70%" min="${today()}" value="${today()}" name="date_time" required>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-5 mb-2">
          <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100%" name="info" required></textarea>
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
      <div id="alert"></div>
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
      </thead>
      <tbody id="allAppointments">`;
    appointments.selected.forEach((appointment, index) => {
      body += `
          <tr id="app-${appointment.randevouz_id}">
            <th scope="row" class="table-warning">Selected</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
            <td>
            <button type="button" class="btn btn-danger" onclick="updateRandevouz('cancelled' , ${
              appointment.randevouz_id
            })">Cancel</button>
            <button type="button" class="btn btn-success" onclick="updateRandevouz('done' , ${
              appointment.randevouz_id
            })" >Done</button>
            </td>
          </tr>`;
    });

    appointments.free.forEach((appointment, index) => {
      body += `
          <tr id="app-${appointment.randevouz_id}">
            <th scope="row" class="table-info">Available</th>
            <td>${appointment.date_time}</td>
            <td>${appointment.price}€</td>
            <td>${appointment.doctor_info}</td>
            <td>${
              appointment.user_info === "null" ? "" : appointment.user_info
            }</td>
            <td>
            <button type="button" class="btn btn-danger" onclick="updateRandevouz('cancelled' , ${
              appointment.randevouz_id
            })">Cancel</button>
            <button type="button" class="btn btn-success" onclick="updateRandevouz('done' , ${
              appointment.randevouz_id
            })" >Done</button>
            </td>
          </tr>`;
    });

    body += `</tbody>
      </table>`;
    modalBody.innerHTML += body;
    document.querySelector("#meeting-time").step = "1800";
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
    </thead>
    <tbody id="allAppointments">`;
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
    let done = `
    <div class="collapse" id="collapseMain"></div>
    <table class="table caption-top table-hover table-striped">
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
    </thead>
    <tbody id="allAppointments">`;
    appointments.done.forEach((appointment, index) => {
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
            <button type="button" class="btn btn-info" onclick = "openHistory(${
              appointment.user_id
            })" >Show History</button>
            </td>
          </tr>
          `;
    });
    done += `</tbody>
      </table>`;
    modalBody.innerHTML += done;
  }
});
