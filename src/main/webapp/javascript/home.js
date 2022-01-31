window.onload = function () {
  isLoggedIn();
};

let FinalUser;

function cleanData(userInput) {
  return DOMPurify.sanitize(userInput, { ALLOWED_TAGS: ["ul", "li"] });
}

function isLoggedIn() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("He is logged in!");
      //set username and image
      let user = JSON.parse(xhr.responseText);
      FinalUser = user;
      console.log(FinalUser);
      document.getElementById("username").innerHTML = `Hello, ${user.username}`;
      if (FinalUser.gender === "Female") {
        document.querySelector("#homeImage").src = "./images/patientFemale.png";
      }
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

const changeSettings = document.querySelector("#changeSettings");
changeSettings.addEventListener("click", function () {
  $("body").load("./settings.html", function () {
    console.log("HERE12");
    console.log(FinalUser);
    document.querySelector("#username").value = FinalUser.username;
    document.querySelector("#email").value = FinalUser.email;
    document.querySelector("#amka").value = FinalUser.amka;
    document.querySelector("#firstname").value = FinalUser.firstname;
    document.querySelector("#lastname").value = FinalUser.lastname;
    document.querySelector("#address").value = FinalUser.address;
    document.querySelector("#city").value = FinalUser.city;
    document.querySelector("#country").value = FinalUser.country;
    document.querySelector("#mobile").value = FinalUser.telephone;
    document.querySelector("#date").value = FinalUser.birthdate;
    document.querySelector("#height").value = FinalUser.height;
    document.querySelector("#weight").value = FinalUser.weight;
    document.querySelector("#blood-type").value = FinalUser.bloodtype;
    FinalUser.blooddonor === 1
      ? (document.querySelector("#yes").checked = true)
      : (document.querySelector("#no").checked = true);
    if (FinalUser.gender === "Male")
      document.querySelector("#male").checked = true;
    else if (FinalUser.gender === "Female")
      document.querySelector("#female").checked = true;
    else document.querySelector("#other").checked = true;
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////
let allDoctors;
const doctors = document.querySelector("#doctors");
doctors.addEventListener("click", function () {
  // $("#main-buttons").load("./doctors.html");
  //get all doctors with AJAX
  let doctorsList = document.getElementById("main-buttons");
  doctorsList.innerHTML = "";
  doctorsList.innerHTML += `<button class="btn btn-dark" onclick="sortByDoctors('distance')">Short By Distance</button>`;
  doctorsList.innerHTML += `<button class="btn btn-dark" onclick="sortByDoctors('car')">Short By Duration</button>`;
  doctorsList.innerHTML += `<button class="btn btn-dark" onclick="sortByDoctors('price')">Short By Price</button>`;
  doctorsList.innerHTML += `<button class="btn btn-dark" onclick="window.location.href='./home.html'">Back To Home</button>`;
});

function getAllDoctors() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      allDoctors = JSON.parse(xhr.responseText);
      console.log(allDoctors);
    } else if (xhr.status !== 200) {
      console.log("error doctors: " + xhr.status);
    }
  };
  xhr.open("GET", "GetAllDoctors", false);
  xhr.send();
}

//todo to fix more than 25 doctors problem
//here is a function to short all doctors by many different criteria
function sortByDoctors(criteria) {
  getAllDoctors();
  console.log(
    `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${origin()}&destinations=${destinations()}`
  );
  fetch(
    `https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=${origin()}&destinations=${destinations()}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "trueway-matrix.p.rapidapi.com",
        "x-rapidapi-key": "b3696e4eebmsh459a92cc3709e66p14cd8djsnd445f9a9aa9e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      sortData(data, criteria);
    })
    .catch((err) => {
      console.error(err);
    });
}

function sortData(data, criteria) {
  console.log(data);
  let i = 0;
  data.distances[0].forEach((element, index) => {
    while (
      allDoctors[i].lat === null ||
      allDoctors[i].lon === null ||
      allDoctors[i].certified === 0
    ) {
      i++;
    }
    if (element === null) {
      allDoctors[i].distance = 1000000000000;
    } else {
      allDoctors[i].distance = element;
    }
    i++;
  });
  i = 0;
  data.durations[0].forEach((element, index) => {
    while (
      allDoctors[i].lat === null ||
      allDoctors[i].lon === null ||
      allDoctors[i].certified === 0
    ) {
      i++;
    }
    if (element === null) {
      allDoctors[i].duration = 100000000000;
    } else {
      allDoctors[i].duration = element;
    }
    i++;
  });
  if (criteria === "distance") {
    allDoctors.sort((a, b) => (a.distance > b.distance ? 1 : -1));
  }
  if (criteria === "car") {
    allDoctors.sort((a, b) => (a.duration > b.duration ? 1 : -1));
  }
  if (criteria === "price") {
    getAllMinPricesOfDoctors();
    //check every doctor if he has a price and remove him if he doesn't
    console.log("All doctors with prices");
    console.log(allDoctors);
    allDoctors = allDoctors.filter((doctor) => {
      if (doctor.minPrice == null) {
        return false;
      } else return true;
    });
    console.log("after Prices");
    console.log(allDoctors);
    allDoctors.sort((a, b) => (a.minPrice > b.minPrice ? 1 : -1));
    //todo fix for the price
  }
  let myModal = new bootstrap.Modal(document.getElementById("showInfo"), {
    keyboard: false,
  });
  myModal.show();
}

function getAllMinPricesOfDoctors() {
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      let prices = JSON.parse(xhr.responseText);
      console.log("Prices: ");
      console.log(prices);
      prices.forEach((element) => {
        allDoctors.forEach((doctor) => {
          if (doctor.doctor_id == element.doctor_id) {
            doctor.minPrice = element.price;
          }
        });
      });
    } else if (xhr.status !== 200) {
      console.log("error doctors: " + xhr.status);
    }
  };
  xhr.open("GET", "GetRandevouzIdPrice", false);
  xhr.send();
}

function origin() {
  let origin = "";
  origin += `${FinalUser.lat}%2C${FinalUser.lon}`;
  return origin;
}

function destinations() {
  let dest = "";
  allDoctors.forEach((element) => {
    if (element.lat === null || element.lon === null || element.certified === 0)
      return;
    dest += `${element.lat}%2C${element.lon}%3B`;
  });
  //remove the last %3B
  return dest.slice(0, -3);
}

//function to open details of a doctor
function openDetails(doctor) {
  let myCollapse = document.getElementById("collapseMain");
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false,
  });
  myCollapse.innerHTML = `
  <div class="card">
    <div class="card-header" id="headingOne" style="color: black;">
      ${allDoctors[doctor].firstname} ${allDoctors[doctor].lastname}
    </div>
    <div class="card-body">
      <br>
      <h5 class="text-center">Doctors Details:</h5>
      <div class="d-flex justify-content-center" id="showDoctorsDetails">${showDoctorsDetails(
        doctor
      )}</div>
      <br>
      <h5 class="text-center">Doctors Randevouz:</h5>
      <div id="alert"></div>
      <div class="overflow-auto my-4" id="showAllRandevouz"> ${showAllDoctorsRandevouz(
        allDoctors[doctor].doctor_id
      )} </div>
      <button type="button" class="btn btn-dark btn-lg my-2" data-bs-toggle="collapse" data-bs-target="#collapseMain">Close</button>
    </div>
  </div>
  `;

  bsCollapse.show();
}

function showDoctorsDetails(doctorID) {
  return cleanData(`
  <ul class="list-group col-7 text-center">
  <li class="list-group-item">City: ${allDoctors[doctorID].city}</li>
  <li class="list-group-item">Address: ${DOMPurify.sanitize(
    allDoctors[doctorID].address
  )}</li>
  <li class="list-group-item">Info: ${allDoctors[doctorID].doctor_info}</li>
  <li class="list-group-item">Speciality: ${allDoctors[doctorID].specialty}</li>
  <li class="list-group-item">Telephone: ${allDoctors[doctorID].telephone}</li>
  </ul>`);
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

function showAllDoctorsRandevouz(doctor_id) {
  let randevouz;
  let json = { id: doctor_id };
  let html = "";
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      randevouz = JSON.parse(xhr.responseText);
      console.log(randevouz);
      if (randevouz.done.length === 0) {
        html = `<h5 class="text-center">No Randevouz</h5>`;
        return;
      }
      html += `
      <table class="table caption-top table-hover table-striped">
      <caption>All Appointments</caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Price</th>
          <th scope="col">Doctor Info</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody id="allAppointments">
      `;
      randevouz.free.forEach((appointment) => {
        html += `
        <tr id="app-${appointment.randevouz_id}">
          <td>${appointment.date_time}</td>
          <td>${appointment.price}€</td>
          <td>${appointment.doctor_info}</td>
          <td>
          <button type="button" class="btn btn-dark" onclick="updateRandevouz('selected' , ${appointment.randevouz_id})">Select Appointment</button>
          </td>
        </tr>`;
      });
      html += `
      </tbody>
      </table>
      `;
    } else if (xhr.status !== 200) {
      console.log("error doctors: " + xhr.status);
    }
  };
  xhr.open("POST", "GetRantevouz", false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(json));
  return html;
}

// end of open details of a doctor

////////////////////////////////////////////////////////////////////////////////////////////////
//function to show all Blood Tests of the user and a form to add a new one
function openAllBloodTests() {
  let myCollapse = document.getElementById("collapseMain");
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false,
  });
  myCollapse.innerHTML = `
  <div class="card">
    <div class="card-header" id="headingOne" style="color: black;">
      All Blood Tests
    </div>
    <div class="card-body">
      <br>
      <div id="addNewBloodTest">${addNewBloodTest()}</div>
      <br>
      <h5 class="text-center">All Blood Tests:</h5>
      <div class="overflow-auto" id="showAllBloodTests">${showAllBloodTests()}</div>
      <br>
      <button type="button" class="btn btn-dark btn-lg my-2" data-bs-toggle="collapse" data-bs-target="#collapseMain">Close</button>
    </div>
  </div>
  `;

  bsCollapse.show();
}
//function to show the form to add new blood test
function addNewBloodTest() {
  let form = ``;
  form += `
  <div class="card my-2">
    <div class="card-header" style="color: black;">
      Add New Blood Test
    </div>
    <div class="card-body">
      <form id="addNewBloodTestForm" onsubmit="sendNewBloodTest(); return false;">
        <div class="form-group">
        <label for="test_date">Test Date</label>
        <input type="date" class="form-control" id="test_date" name="test_date" required>
        <label for="medical_center">Medical Center</label>
        <input type="text" class="form-control" id="medical_center" name="medical_center" required>
        <label for="blood_sugar">Blood Sugar</label>
        <input type="number" class="form-control" id="blood_sugar" name="blood_sugar">
        <label for="cholesterol">Cholesterol</label>
        <input type="number" class="form-control" id="cholesterol" name="cholesterol">
        <label for="iron">Iron</label>
        <input type="number" class="form-control" id="iron" name="iron">
        <label for="vitamin_d3">Vitamin D3</label>
        <input type="number" class="form-control" id="vitamin_d3" name="vitamin_d3">
        <label for="vitamin_b12">Vitamin B12</label>
        <input type="number" class="form-control" id="vitamin_b12" name="vitamin_b12">
        <button type="submit" class="btn btn-dark my-2">Add new Blood Test</button>
        <div id="alert"></div>
        </div>
      </form>
    </div>
  </div>
  `;
  return form;
}

function sendNewBloodTest() {
  let json = {};
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      console.log("Blood Test added");
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="danger">
      Treatment Added!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
      document.querySelector("#addNewBloodTestForm").reset();
      document.querySelector(
        "#showAllBloodTests"
      ).innerHTML = `${showAllBloodTests()}
      `;
    } else {
      console.log("Error");
      console.log(xhr.responseText);
      document.querySelector("#alert").innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="danger">
      ${JSON.parse(xhr.responseText).error}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }
  };
  const myForm = document.querySelector("#addNewBloodTestForm");
  let formData = new FormData(myForm);
  formData.forEach((value, key) => {
    json[key] = value;
  });
  json["amka"] = FinalUser.amka;
  //remove every property that is empty string
  for (let key in json) {
    if (json[key] == "") {
      delete json[key];
    }
  }
  console.log(json);
  xhr.open("POST", "NewBloodTest", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));
}

//function to show all Blood Tests of the user
function showAllBloodTests() {
  let json = {};
  json["user_id"] = FinalUser.user_id;
  let xhr = new XMLHttpRequest();
  let allBloodTestsAndTreatments;
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("All Blood Tests");
      allBloodTestsAndTreatments = JSON.parse(xhr.responseText);
      console.log(allBloodTestsAndTreatments);
    } else {
      console.log("Error");
      console.log(xhr.responseText);
    }
  };
  xhr.open("POST", "UserBloodtest", false);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));

  let allBloodTests = `
  <table class="table caption-top table-hover table-striped table-sm">
      <caption>All BloodTests</caption>
      <thead>
        <tr>
          <th scope="col">Test Date</th>
          <th scope="col">Medical Center</th>
          <th scope="col">Blood Sugar</th>
          <th scope="col">Blood Sugar Level</th>
          <th scope="col">Cholesterol</th>
          <th scope="col">Cholesterol Level</th>
          <th scope="col">Iron</th>
          <th scope="col">Iron Level</th>
          <th scope="col">Vitamin D3</th>
          <th scope="col">Vitamin D3 Level</th>
          <th scope="col">Vitamin B12</th>
          <th scope="col">Vitamin B12 Level</th>
        </tr>
      </thead>
      <tbody id="allTests">
  `;
  allBloodTestsAndTreatments.bloodtest.forEach((bloodtest) => {
    allBloodTests += `
    <tr>
      <td>${bloodtest.test_date}</td>
      <td>${bloodtest.medical_center}</td>
      <td>${bloodtest.blood_sugar}</td>
      <td>${
        bloodtest.blood_sugar_level === "null"
          ? ""
          : bloodtest.blood_sugar_level
      }</td>
      <td>${bloodtest.cholesterol}</td>
      <td>${
        bloodtest.cholesterol_level === "null"
          ? ""
          : bloodtest.cholesterol_level
      }</td>
      <td>${bloodtest.iron}</td>
      <td>${bloodtest.iron_level === "null" ? "" : bloodtest.iron_level}</td>
      <td>${bloodtest.vitamin_d3}</td>
      <td>${
        bloodtest.vitamin_d3_level === "null" ? "" : bloodtest.vitamin_d3_level
      }</td>
      <td>${bloodtest.vitamin_b12}</td>
      <td>${
        bloodtest.vitamin_b12_level === "null"
          ? ""
          : bloodtest.vitamin_b12_level
      }</td>
    </tr>
    `;
  });
  allBloodTests += `
      </tbody>
    </table>
  `;
  return allBloodTests;
}
//end of show all Blood Tests of the user
////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////
//start to show all blood tests and Treatments of the user for specific dates

function searchBloodTests() {
  let json = {};
  const myForm = document.querySelector("#BloodTestsSearch");
  let formData = new FormData(myForm);
  formData.forEach((value, key) => {
    json[key] = value;
  });
  json["amka"] = FinalUser.amka;
  let xhr = new XMLHttpRequest();
  let allBloodTestsAndTreatments;
  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("All Blood Tests");
      allBloodTestsAndTreatments = JSON.parse(xhr.responseText);
      console.log(allBloodTestsAndTreatments);
      openAllBloodTestsAndTreatmentsForaDate(allBloodTestsAndTreatments);
      //show collapseMain
    } else {
      console.log("Error");
      console.log(xhr.responseText);
    }
  };
  xhr.open("POST", "GetBloodTest", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(JSON.stringify(json));
}

//function to show all Blood Tests of the user and a form to add a new one
function openAllBloodTestsAndTreatmentsForaDate(allBloodTestsAndTreatments) {
  let myCollapse = document.getElementById("collapseMain");
  let bsCollapse = new bootstrap.Collapse(myCollapse, {
    toggle: false,
  });
  myCollapse.innerHTML = `
  <div class="card">
    <div class="card-header" id="headingOne" style="color: black;">
      All Blood Tests and Treatments
    </div>
    <div class="card-body">
      <h5 class="text-center">All Blood Tests:</h5>
      <div class="overflow-auto" id="showAllBloodTests">${showAllBloodTestsAndCharts(
        allBloodTestsAndTreatments
      )}</div>
      <br>
      <h5 class="text-center">All Treatments:</h5>
      <div class="overflow-auto" id="showAllTreatments">${showAllTreatments(
        allBloodTestsAndTreatments
      )}</div>
      <br>
      <button type="button" class="btn btn-dark btn-lg my-2" data-bs-toggle="collapse" data-bs-target="#collapseMain">Close</button>
    </div>
  </div>
  `;
  bsCollapse.show();
}

//end of show all blood tests and Treatments of the user for specific dates
////////////////////////////////////////////////////////////////////////////////

//here is a function that opens the modal widget
let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info;
  try {
    info = button.getAttribute("data-bs-whatever");
  } catch (error) {}
  let modalTitle = document.querySelector(".modal-title");
  let modalBody = document.querySelector(".modal-body");
  if (info === "bmiInfo") {
    //check If I have weight and height data
    if (FinalUser.weight == 0 || FinalUser.height == 0) {
      modalTitle.innerHTML = "Error showing BMI";
      modalBody.innerHTML =
        "You need to set your height and weight to see your BMI";
      return;
    }

    modalBody.innerHTML = `<div class="d-flex justify-content-center">
    <ul class="list-group col-6 text-center" id="bmiClass"></ul></div>`;
    BMIcalculator(
      (bmi) => {
        document.getElementById("bmiClass").innerHTML += `
      <li class="list-group-item">Your BMI is: ${bmi.bmi}</li>
      <li class="list-group-item">Your Health is: ${bmi.health}</li>
      `;
        modalTitle.innerHTML = "BMI Calculator";
      },
      (idealWeight) => {
        document.getElementById(
          "bmiClass"
        ).innerHTML += `<li class="list-group-item">Your Ideal Weight is: ${idealWeight.Devine}</li>`;
      }
    );
  } else if (info === "bloodtestsInfo") {
    modalTitle.innerHTML = "Blood Tests";
    modalBody.innerHTML = `<div class="collapse mb-3" id="collapseMain"></div>`;
    modalBody.innerHTML += `<div class="d-grid gap-3 col-6 mx-auto" id="mainBloodTests"></div>`;
    let mainBloodTests = document.getElementById("mainBloodTests");
    mainBloodTests.innerHTML = `
    <button type="button" class="btn btn-dark" onclick="openAllBloodTests()">
      Add new blood test
    </button>
    `;
  } else if (info === "bloodtestsHistory") {
    modalTitle.innerHTML = "Blood Tests History";
    modalBody.innerHTML = `<div class="collapse mb-3" id="collapseMain"></div>`;
    //search for blood tests between dates
    modalBody.innerHTML += `<div my-4 id="MainBloodTestsSearch">
    <form id="BloodTestsSearch" onsubmit="searchBloodTests(); return false;">
      <label for="min_date" class="form-label">From</label>
      <input type="date" class="form-control mb-2" id="min_date" name="min_date" required>
      <label for="max_date" class="form-label">To</label>
      <input type="date" class="form-control mb-2" id="max_date" name="max_date" required>
      <button type="submit" class="btn btn-dark mb-2">Search</button>
      <div id="alert"></div>
    </form>
    </div>`;
  } else {
    //show all doctors
    modalTitle.innerHTML = "All Doctors";
    modalBody.innerHTML = `<div class="collapse mb-3" id="collapseMain"></div>`;
    modalBody.innerHTML += `<div class="d-grid gap-3 col-6 mx-auto" id="mainDoctors"></div>`;
    let mainDoctors = document.getElementById("mainDoctors");
    allDoctors.forEach((doctor, index) => {
      if (doctor.certified == 0) return; //skip if not certified
      mainDoctors.innerHTML += `
        <button type="button" class="btn btn-dark" onclick="openDetails(${index})">
          ${doctor.firstname} ${doctor.lastname}
        </button>
        `;
    });
  }
});

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function BMIcalculator(cb, cb2) {
  fetch(
    `https://fitness-calculator.p.rapidapi.com/bmi?age=${getAge(
      FinalUser.birthdate
    )}&weight=${FinalUser.weight}&height=${FinalUser.height}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
        "x-rapidapi-key": "b3696e4eebmsh459a92cc3709e66p14cd8djsnd445f9a9aa9e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cb(data.data);
    })
    .catch((err) => {
      console.log(err);
    });

  fetch(
    `https://fitness-calculator.p.rapidapi.com/idealweight?gender=${FinalUser.gender.toLowerCase()}&height=${
      FinalUser.height
    }`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "fitness-calculator.p.rapidapi.com",
        "x-rapidapi-key": "b3696e4eebmsh459a92cc3709e66p14cd8djsnd445f9a9aa9e",
      },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      cb2(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

//gia na ftiaksw to problhma p dn evriske thn synarthsh
function cc() {
  updateSettings();
}
