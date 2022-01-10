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
      //GIA NA DEIS THN ASKHSH 3 KANE UNCOMMENT TIS 2 EPOMENES GRAMMES KAI COMMENT THN PROHGOUMENH
      //AYTH H GRAMMH EINAI ME TO BUG GIA TO ATTACK
      // document.getElementById('username').innerHTML = user.address;
      //AYTH H GRAMMH EINAI GIA NA FIXAREIS TO BUG
      // document.getElementById('username').innerText = user.address;
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

let allDoctors;
const doctors = document.querySelector("#doctors");
doctors.addEventListener("click", function () {
  // $("#main-buttons").load("./doctors.html");
  //get all doctors with AJAX
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      allDoctors = JSON.parse(xhr.responseText);
      //set doctors
      console.log(allDoctors);
      let doctorsList = document.getElementById("main-buttons");
      doctorsList.innerHTML = "";
      for (let i = 0; i < allDoctors.length; i++) {
        let doctor = allDoctors[i];
        if (doctor.certified == 0) continue; //skip if not certified
        doctorsList.innerHTML += `<!-- Button trigger modal -->
        <button type="button" class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#showInfo" data-bs-whatever=${i} >
          ${doctor.firstname} ${doctor.lastname}
        </button>
        `;
      }
      doctorsList.innerHTML += `<button class="btn btn-dark" onclick="window.location.href='./home.html'">Back To Home</button>`;
    } else if (xhr.status !== 200) {
      console.log("error doctors: " + xhr.status);
    }
  };
  xhr.open("GET", "GetAllDoctors", true);
  xhr.send();
});

//here is a function that opens the modal widget
let AllInfo = document.querySelector("#showInfo");
AllInfo.addEventListener("show.bs.modal", function (event) {
  // Button that triggered the modal
  let button = event.relatedTarget;
  // Extract info from data-bs-* attributes
  let info = button.getAttribute("data-bs-whatever");
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

    modalBody.innerHTML = "";
    return BMIcalculator(
      (bmi) => {
        modalBody.innerHTML += `<ul class="list-group">
      <li class="list-group-item">Your BMI is: ${bmi.bmi}</li>
      <li class="list-group-item">Your Health is: ${bmi.health}</li>
      </ul>
      `;
        modalTitle.innerHTML = "BMI Calculator";
      },
      (idealWeight) => {
        modalBody.innerHTML += `<li class="list-group-item">Your Ideal Weight is: ${idealWeight.Devine}</li>
      </ul>`;
      }
    );
  }

  //GIA NA DEIS THN ASKHSH 3 KANE UNCOMMENT TA COMMENTS
  let doctorInfo = button.getAttribute("data-bs-whatever");
  modalTitle.innerHTML = `${allDoctors[doctorInfo].firstname} ${allDoctors[doctorInfo].lastname}`;
  //<li class="list-group-item">Address: ${allDoctors[doctorInfo].address}</li>
  modalBody.innerHTML = cleanData(`<ul class="list-group">
  <li class="list-group-item">City: ${allDoctors[doctorInfo].city}</li>
  <li class="list-group-item">Address: ${DOMPurify.sanitize(
    allDoctors[doctorInfo].address
  )}</li>
  <li class="list-group-item">Info: ${allDoctors[doctorInfo].doctor_info}</li>
  <li class="list-group-item">Speciality: ${
    allDoctors[doctorInfo].specialty
  }</li>
  <li class="list-group-item">Telephone: ${
    allDoctors[doctorInfo].telephone
  }</li>
</ul>`);
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
    "https://fitness-calculator.p.rapidapi.com/idealweight?gender=male&height=180",
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
