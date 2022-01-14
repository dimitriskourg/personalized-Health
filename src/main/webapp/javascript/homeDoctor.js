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
    modalTitle.innerHTML = "New Appointment";
    modalBody.innerHTML = `
    <form id="newAppointment" class="container">
      <h3 class="text-center">New Appointment</h3>
      <div class="row">
        <div class="col-md-2">
          <div class="form-floating mb-3 col=4">
            <input type="number" class="form-control" id="price" placeholder="50€">
            <label for="price">Appointment Price</label>
          </div>
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-6">
          <input type="datetime-local" id="meeting-time" style="width:30%">
        </div>
      </div>
      <div class="row mb-2">
        <div class="col-md-5 mb-2">
          <div class="form-floating">
            <textarea class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
            <label for="floatingTextarea2">Comments</label>
          </div>
        </div>
        <div class="col-md-1">
        <input
          type="submit"
          value="Add New Appointment"
          class="btn btn-dark"
          id="addNewAppointment"
          style="height: 100%"
        />
        </div>
      </div>
    </form>`;
  } else if (info === "canceledAppointments") {
    modalTitle.innerHTML = "Canceled Appointments";
  } else if (info === "doneAppointments") {
    modalTitle.innerHTML = "Done Appointments";
  }
});
