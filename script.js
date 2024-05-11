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

  // Edit Task functionality
  $(document).on("click", ".edit-task-btn", function () {
    var taskTitle = $(this).closest(".card").find(".card-title").text();
    var taskDescription = $(this).closest(".card").find(".card-text").text();
    var taskId = $(this).closest(".card").data("task-id"); // Get the task ID from the card

    $("#edit-task-form").attr("data-task-id", taskId); // Set the task ID on the form

    $("#editTaskName").val(taskTitle);
    $("#editTaskDescription").val(taskDescription);

    $("#edit-task-modal").modal("show");
  });

  $("#edit-task-form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    var taskId = $(this).data("task-id");
    var taskName = $("#editTaskName").val();
    var taskDescription = $("#editTaskDescription").val();

    if (taskName === "" || taskDescription === "") {
      alert("Please fill in all fields");
      return;
    }

    updateTask(taskId, taskName, taskDescription); // Call the updateTask function

    $("#edit-task-modal").modal("hide"); // Hide the modal after processing
  });

  // Delete Task functionality
  $(document).on("click", ".delete-task-btn", function () {
    var taskId = $(this).data("task-id");

    deleteTask(taskId); // Call the deleteTask function
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
            <div class="card" data-task-id="${task._id}">
              <div class="card-body">
                <h5 class="card-title">${task.title}</h5>
                <p class="card-text">${task.description}</p>
              </div>
              <div class="card-footer">
                <button data-task-id="${task._id}" class="btn btn-primary edit-task-btn">Edit</button>
                <button data-task-id="${task._id}" class="btn btn-danger delete-task-btn">Delete</button>
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

const updateTask = (taskId, taskName, taskDescription) => {
  $.ajax({
    url: `https://api.nstack.in/v1/todos/${taskId}`,
    method: "PUT",
    data: {
      title: taskName,
      description: taskDescription,
    },
    success: function (response) {
      console.log("Task updated successfully:", response);
      getTasks();
    },
    error: function (error) {
      console.error("Error updating task:", error);
    },
  });
};

const deleteTask = (taskId) => {
  // Make a DELETE request to delete a task using the API
  $.ajax({
    url: `https://api.nstack.in/v1/todos/${taskId}`,
    method: "DELETE",
    success: function (response) {
      console.log("Task deleted successfully:", response);
      getTasks();
    },
    error: function (error) {
      console.error("Error deleting task:", error);
      // Handle the error, like displaying an error message
    },
  });
};
