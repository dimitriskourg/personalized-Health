let checkboxes = {
  username: true,
  email: true,
  amka: true,
};

let lat = 0;
let lon = 0;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  } else {
    autofill.style.display = "none";
    autofill.classList.remove("fa-compass");
  }
}

getLocation();

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

//for icon toggle and change password type
togglePassword.addEventListener("click", function (e) {
  // toggle the type attribute
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  //togle the eye icon
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

//check if the username is already taken with AJAX
const usernameError = document.querySelector("#usernameError");
const usrname = document.querySelector("#user-name");
usrname.addEventListener("keyup", function (e) {
  if (usrname.value.length > 6) {
    //make usrname a json object
    const usrnameJson = {
      type: "username",
      info: usrname.value,
    };
    let data = JSON.stringify(usrnameJson);
    //send the json object to the server
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        usernameError.style.display = "none";
        usernameError.innerHTML = "";
        checkboxes.username = true;
      } else if (xhr.status !== 200) {
        if (xhr.status === 403) {
          const response = JSON.parse(xhr.responseText);
          usernameError.style.display = "block";
          usernameError.innerHTML = response.error;
          checkboxes.username = false;
        } else {
          console.log("error");
        }
      }
    };
    xhr.open("POST", "CheckFirstParams", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
  }
});

//check if email is already taken with AJAX
const emailError = document.querySelector("#emailError");
const email = document.querySelector("#email");
email.addEventListener("keyup", function (e) {
  if (email.value.length > 3) {
    //make email a json object
    const emailJson = {
      type: "email",
      info: email.value,
    };
    let data = JSON.stringify(emailJson);
    //send the json object to the server
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        emailError.style.display = "none";
        emailError.innerHTML = "";
        checkboxes.email = true;
      } else if (xhr.status !== 200) {
        if (xhr.status === 403) {
          const response = JSON.parse(xhr.responseText);
          emailError.style.display = "block";
          emailError.innerHTML = response.error;
          checkboxes.email = false;
        } else {
          console.log("error");
        }
      }
    };
    xhr.open("POST", "CheckFirstParams", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
  }
});

//password missmatch
const password2 = document.querySelector("#password2");
const password2Error = document.querySelector("#password2Error");

password2.addEventListener("input", passMissMatch);
password.addEventListener("input", passMissMatch);

function passMissMatch(e) {
  if (password2.value !== password.value) {
    password2Error.style.display = "block";
    password2Error.innerHTML = "passwords does not match";
  } else {
    password2Error.innerHTML = "";
    password2Error.style.display = "none";
  }
  if (password2.value === "") {
    password2Error.innerHTML = "";
    password2Error.style.display = "none";
  }
}

//chech for password strength
const passwordStrength = document.querySelector("#passwordStrength");

password.addEventListener("input", function (e) {
  if (password.value.length < 8) {
    passwordStrength.innerHTML = "";
    passwordStrength.style.display = "none";
    return;
  }
  const strength = checkPasswordStrength(password.value);
  const strengthText = ["Weak", "Medium", "Strong"];
  passwordStrength.style.display = "block";
  passwordStrength.innerHTML = `Password strength: ${strengthText[strength]}`;
  //change color
  if (strength === 0) {
    passwordStrength.style.color = "rgb(185, 9, 9)";
  } else if (strength === 1) {
    passwordStrength.style.color = "rgb(255, 165, 0)";
  } else {
    passwordStrength.style.color = "rgb(0, 128, 0)";
  }
});

function checkPasswordStrength(password) {
  //if half of the password is a number  return 0
  if (
    password.match(/[0-9]/g) != null &&
    password.match(/[0-9]/g).length / password.length > 0.5
  ) {
    return 0;
  }
  //removing duplicates using filter function
  //including only elements whose indexes match their indexOf value
  const uniqueChars = password
    .split("")
    .filter((char, index) => password.indexOf(char) === index);
  //if 80% of the password is unique return 2
  if (uniqueChars.length / password.length >= 0.8) {
    return 2;
  }
  //if a character is 50% of the password return 0
  for (let i = 0; i < password.length; i++) {
    if (password.split(password[i]).length - 1 >= password.length / 2) {
      console.log(password.split(password[i]));
      return 0;
    }
  }
  return 1;
}

//check for doctor user
const doctor = document.querySelector("#doctor");
const defaultUser = document.querySelector("#def-user");
doctor.addEventListener("change", function (e) {
  document.querySelector("#speciality").style.display = "block";
  document.querySelector("#doctor-info").style.display = "block";
  document.querySelector("#address").placeholder = "Office Address";
});

defaultUser.addEventListener("change", function (e) {
  document.querySelector("#speciality").style.display = "none";
  document.querySelector("#doctor-info").style.display = "none";
  document.querySelector("#address").placeholder = "Address";
});

//AMKA check
const amka = document.querySelector("#amka");
const amkaError = document.querySelector("#amkaError");
const date = document.querySelector("#date");
amka.addEventListener("input", AmkaChecker);
date.addEventListener("input", AmkaChecker);

function AmkaChecker(e) {
  //check if AMKA is already taken with AJAX
  if (amka.value.length === 11) {
    const amkaJson = {
      type: "amka",
      info: amka.value,
    };
    let data = JSON.stringify(amkaJson);
    //send the json object to the server
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status === 200) {
        checkboxes.amka = true;
      } else if (xhr.status !== 200) {
        if (xhr.status === 403) {
          const response = JSON.parse(xhr.responseText);
          amkaError.style.display = "block";
          amkaError.innerHTML = response.error;
          checkboxes.amka = false;
        } else {
          console.log("error");
        }
      }
    };
    xhr.open("POST", "CheckFirstParams", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
  }

  if (amka.value.length < 6) {
    amkaError.innerHTML = "";
    amkaError.style.display = "none";
    return;
  }
  const datecheck = date.value.split("-");
  const finalDate = datecheck[2] + datecheck[1] + datecheck[0].substring(2, 4);
  //the first 6 digits of amka should be equal to the date of birth
  if (amka.value.substring(0, 6) !== finalDate) {
    amkaError.innerHTML = "AMKA is not valid";
    amkaError.style.display = "block";
  } else {
    amkaError.innerHTML = "";
    amkaError.style.display = "none";
  }
}

//check if terms ckecked
const terms = document.querySelector("#terms");
const termsError = document.querySelector("#termsError");
const submit = document.querySelector('input[type="submit"]');

// submit.addEventListener('click', finalCheck);

function RegisterPost() {
  let myForm = document.querySelector("#register");
  let formData = new FormData(myForm);
  let data = {};
  formData.forEach(function (value, key) {
    data[key] = value;
  });
  data["lat"] = lat;
  data["lon"] = lon;
  if (data.height === "") {
    data.height = 0;
  }
  if (data.weight === "") {
    data.weight = 0;
  }
  delete data["password2"];
  delete data["terms"];
  if (data.user_type === "Default") {
    delete data["specialty"];
    delete data["doctor_info"];
  } else {
    data["certified"] = "0";
  }
  console.log(data);
  let json = JSON.stringify(data);

  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      console.log(response);
      if (Object.keys(response).length !== 0) {
        termsError.innerHTML = response.error;
        termsError.style.display = "block";
      } else {
        termsError.style.display = "none";
        termsError.innerHTML = "";
      }
    } else if (xhr.status !== 200) {
      console.log("error");
    }
  };
  xhr.open("POST", "RegisterUser", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
  xhr.send(json);
}

function finalCheck() {
  if (terms.checked === false) {
    // e.preventDefault()
    termsError.style.display = "block";
    termsError.innerHTML = "You must agree to the terms and conditions";
    return false;
  }
  if (password2Error.innerHTML !== "") {
    // e.preventDefault()
    termsError.style.display = "block";
    termsError.innerHTML = "Passwords does not match";
    return false;
  }
  if (amkaError.innerHTML !== "") {
    // e.preventDefault()
    termsError.style.display = "block";
    termsError.innerHTML = "AMKA is not valid";
    return false;
  }
  if (
    checkboxes.amka === false ||
    checkboxes.username === false ||
    checkboxes.email === false
  ) {
    // e.preventDefault()
    termsError.style.display = "block";
    termsError.innerHTML = "Please fill out all the fields correctly";
    return false;
  }

  console.log("EDWWW");
  RegisterPost();
  // e.preventDefault();
}

//MAPS
const countryInput = document.querySelector("#country");
countryInput.value = "Greece";
const cityInput = document.querySelector("#city");
const addressInput = document.querySelector("#address");
const addressError = document.querySelector("#addressError");
const toggleMap = document.querySelector("#toggleMap");
const autofill = document.querySelector("#autofill");
const mapContainer = document.querySelector("#map");

function showPosition(position) {
  console.log(
    "Latitude: " +
      position.coords.latitude +
      " Longitude: " +
      position.coords.longitude
  );
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}

autofill.addEventListener("click", autoAddress);
country.addEventListener("change", findAddress);
city.addEventListener("change", findAddress);
address.addEventListener("change", findAddress);
toggleMap.addEventListener("click", showMap);

function autoAddress() {
  getLocation();
  if (lat == undefined || lon == undefined) {
    addressError.style.display = "block";
    addressError.innerHTML = "Autofill address Error";
  }

  const data = null;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      console.log(this.responseText);
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(this.responseText, "text/xml");
      country.value =
        xmlDoc.getElementsByTagName("country")[0].childNodes[0].nodeValue;
      city.value =
        xmlDoc.getElementsByTagName("city")[0].childNodes[0].nodeValue;
      // city.setAttribute('value', xmlDoc.getElementsByTagName("city")[0].childNodes[0].nodeValue);
      let citAdd =
        xmlDoc.getElementsByTagName("road")[0].childNodes[0].nodeValue +
        " " +
        xmlDoc.getElementsByTagName("result")[0].getAttribute("address_rank");
      // address.setAttribute('value', citAdd);
      address.value = citAdd;
      console.log(citAdd);
      findAddress();
    }
  });

  xhr.open(
    "GET",
    "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=" +
      lat +
      "&lon=" +
      lon +
      "&accept-language=en&format=xml&polygon_threshold=0.0"
  );
  xhr.setRequestHeader(
    "x-rapidapi-host",
    "forward-reverse-geocoding.p.rapidapi.com"
  );
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "b3696e4eebmsh459a92cc3709e66p14cd8djsnd445f9a9aa9e"
  );
  xhr.send(data);
}

function findAddress() {
  if (
    countryInput.value === "" ||
    cityInput.value === "" ||
    addressInput.value === ""
  ) {
    toggleMap.classList.remove("fa-map-marked-alt");
    toggleMap.style.display = "none";
    return;
  }
  const address =
    addressInput.value + " " + cityInput.value + " " + countryInput.value;

  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const obj = JSON.parse(xhr.responseText);
      // console.log(obj);
      // console.log(obj.length);
      if (!Array.isArray(obj)) {
        addressError.style.display = "block";
        addressError.innerHTML = "Address is not valid";
        toggleMap.classList.remove("fa-map-marked-alt");
        toggleMap.style.display = "none";
        mapContainer.style.display = "none";
      } else {
        addressError.style.display = "none";
        lat = obj[0].lat;
        lon = obj[0].lon;
        toggleMap.style.display = "inline";
        toggleMap.classList.add("fa-map-marked-alt");

        //check if There is a word Crete in the display_name in the JSON object
        if (!obj[0].display_name.includes("Crete")) {
          addressError.style.display = "block";
          addressError.innerHTML =
            "This service is currently available only in Crete";
        }
      }
    }
  });

  xhr.open(
    "GET",
    "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" +
      address +
      "&acceptlanguage=en&polygon_threshold=0.0"
  );
  xhr.setRequestHeader(
    "x-rapidapi-host",
    "forward-reverse-geocoding.p.rapidapi.com"
  );
  xhr.setRequestHeader(
    "x-rapidapi-key",
    "b3696e4eebmsh459a92cc3709e66p14cd8djsnd445f9a9aa9e"
  );
  xhr.send(data);
}

function isVisible(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}

let map;
let markers;

function showMap() {
  //check if mapContainer is visible
  if (isVisible(mapContainer)) {
    mapContainer.style.display = "none";
    return;
  }
  mapContainer.style.display = "block";
  //Orismos Marker
  // check if map is already created
  console.log(map);
  if (!map) {
    map = new OpenLayers.Map("map");
    let mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
    //Markers
    markers = new OpenLayers.Layer.Markers("Markers");
    map.addLayer(markers);
  }

  //Orismos Thesis
  function setPosition(lat, lon) {
    var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(lon, lat).transform(
      fromProjection,
      toProjection
    );
    return position;
  }
  //Protos Marker
  var position = setPosition(lat, lon);
  var mar = new OpenLayers.Marker(position);
  markers.clearMarkers();
  markers.addMarker(mar);

  //Orismos zoom
  const zoom = 10;
  map.setCenter(position, zoom);
}
