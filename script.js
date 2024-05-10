$(document).ready(function () {
  // Code to run when the document is ready
  getTasks(); // Call the getTasks function

  $("#new-task-btn").click(function () {
    $("#new-task-modal").modal("show");
  });

  $("#task-form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Access form data using jQuery
    var taskName = $("#taskName").val();
    var taskDescription = $("#taskDescription").val();

    if (taskName === "" || taskDescription === "") {
      alert("Please fill in all fields");
      return;
    }

    createTask(taskName, taskDescription); // Call the createTask function

    $("#new-task-modal").modal("hide"); // Hide the modal after processing
  });

  $("#new-task-modal").on("hidden.bs.modal", function () {
    // Clear form fields when modal is hidden
    $("#task-form")[0].reset();
  });

  $(".close").click(function () {
    $("#new-task-modal").modal("hide");
  });
});

const createTask = (taskName, taskDescription) => {
  // Make a POST request to create a new task using the API
  $.ajax({
    url: "https://api.nstack.in/v1/todos",
    method: "POST",
    data: {
      title: taskName,
      description: taskDescription,
    },
    success: function (response) {
      console.log("Task created successfully:", response);
      getTasks();
    },
    error: function (error) {
      console.error("Error creating task:", error);
      // Handle the error, like displaying an error message
    },
  });
};

const getTasks = async () => {
  // Make a GET request to fetch all tasks using the API
  $.ajax({
    url: "https://api.nstack.in/v1/todos",
    method: "GET",
    success: function (response) {
      console.log("Tasks fetched successfully:", response.items.length);
      if (response.items.length === 0) {
        $(".default-text").show();
        $(".task-list").addClass("hidden");
      } else {
        $(".default-text").hide();
        $(".task-list").removeClass("hidden");

        $(".task-list").empty();

        // Loop through the tasks and display them in the UI
        response.items.forEach((task) => {
          var taskCard = `
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
              </div>
              <div class="card-footer">
                <button class="btn btn-primary">Edit</button>
                <button class="btn btn-danger">Delete</button>
              </div>
            </div>
          `;
          $(".task-list").append(taskCard);
        });
      }
    },
    error: function (error) {
      console.error("Error fetching tasks:", error);
      // Handle the error, like displaying an error message
    },
  });
};
