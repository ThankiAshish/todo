const API_ENDPOINT = "https://api.nstack.in/v1/todos";

$(document).ready(function () {
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
    $("#edit-task-modal").modal("hide");
  });

  // Edit Task functionality
  $(document).on("click", ".edit-task-btn", function () {
    var taskTitle = $(this).closest(".card").find(".card-title").text();
    var taskDescription = $(this).closest(".card").find(".card-text").text();
    var taskId = $(this).closest(".card").data("task-id"); // Get the task ID from the card
    var isCompleted = $(this).closest(".card").hasClass("completed"); // Get the is_completed property of the task

    $("#edit-task-form").attr("data-task-id", taskId); // Set the task ID on the form

    $("#editTaskName").val(taskTitle);
    $("#editTaskDescription").val(taskDescription);
    $("#editTaskIsCompleted").prop("checked", isCompleted); // Set the is_completed property of the task

    $("#edit-task-modal").modal("show");
  });

  $("#edit-task-form").submit(function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    var taskId = $(this).data("task-id");
    var taskName = $("#editTaskName").val();
    var taskDescription = $("#editTaskDescription").val();
    var taskIsCompleted = $("#editTaskIsCompleted").is(":checked"); //Get the is_completed property of the task

    if (taskName === "" || taskDescription === "") {
      alert("Please fill in all fields");
      return;
    }

    updateTask(taskId, taskName, taskDescription, taskIsCompleted); // Call the updateTask function

    $("#edit-task-modal").modal("hide"); // Hide the modal after processing
  });

  // Delete Task functionality
  $(document).on("click", ".delete-task-btn", function () {
    var taskId = $(this).data("task-id");

    deleteTask(taskId); // Call the deleteTask function
  });

  // Mark as Completed functionality
  $(document).on("click", ".mark-as-completed-btn", function () {
    var taskId = $(this).data("task-id");
    var taskTitle = $(this).closest(".card").find(".card-title").text();
    var taskDescription = $(this).closest(".card").find(".card-text").text();
    var taskId = $(this).closest(".card").data("task-id"); // Get the task ID from the card
    var isCompleted = $(this).hasClass("completed"); // Get the is_completed property of the task

    toggleTaskCompletion(taskId, taskTitle, taskDescription, !isCompleted); // Call the toggleTaskCompletion function
  });
});

const getTasks = async () => {
  $("#loading-spinner").show(); // Show the loading spinner
  $(".default-text").hide(); // Hide the default text

  try {
    const response = await fetch(API_ENDPOINT);
    const tasks = await response.json();

    if (tasks.items.length === 0) {
      $(".default-text").show(); // Show the default text if no tasks are found
      $("#task-list").addClass("hidden");
    } else {
      $(".default-text").hide(); // Hide the default text if tasks are found
      $("#task-list").empty();
      $("#task-list").removeClass("hidden");

      tasks.items.forEach((task) => {
        const taskCard = `
          <div class="card${
            task.is_completed ? " completed" : ""
          }" data-task-id="${task._id}">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
            </div>
            <div class="card-footer">
              <button data-task-id="${
                task._id
              }" class="btn btn-primary edit-task-btn">Edit</button>
              <button data-task-id="${
                task._id
              }" class="btn btn-danger delete-task-btn">Delete</button>
              <button data-task-id="${
                task._id
              }" class="btn btn-success mark-as-completed-btn${
          task.is_completed ? " completed" : ""
        }">
                <i class="bi ${
                  task.is_completed ? "bi-check-circle-fill" : "bi-check-circle"
                }"></i>
              </button>
            </div>
          </div>
        `;
        $("#task-list").append(taskCard);
      });
    }
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    $("#loading-spinner").hide(); // Hide the loading spinner
  }
};

const createTask = async (taskName, taskDescription) => {
  $(".default-text").hide(); // Hide the default text
  $("#loading-spinner").show(); // Show the loading spinner
  $("#task-list").addClass("hidden");

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskName, description: taskDescription }),
    });
    const task = await response.json();
    console.log("Task created successfully:", task);
    getTasks();
  } catch (error) {
    console.error("Error creating task:", error);
    // Handle the error, like displaying an error message
  } finally {
    $("#loading-spinner").hide(); // Hide the loading spinner
  }
};

const updateTask = async (
  taskId,
  taskName,
  taskDescription,
  taskIsCompleted
) => {
  $(".default-text").hide(); // Hide the default text
  $("#loading-spinner").show(); // Show the loading spinner
  $("#task-list").addClass("hidden");

  try {
    const response = await fetch(`${API_ENDPOINT}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskName,
        description: taskDescription,
        is_completed: taskIsCompleted,
      }),
    });
    const task = await response.json();
    console.log("Task updated successfully:", task);
    getTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    // Handle the error, like displaying an error message
  } finally {
    $("#loading-spinner").hide(); // Hide the loading spinner
  }
};

const deleteTask = async (taskId) => {
  $(".default-text").hide(); // Hide the default text
  $("#loading-spinner").show(); // Show the loading spinner
  $("#task-list").addClass("hidden");

  try {
    const response = await fetch(`${API_ENDPOINT}/${taskId}`, {
      method: "DELETE",
    });
    const task = await response.json();
    console.log("Task deleted successfully:", task);
    getTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    // Handle the error, like displaying an error message
  } finally {
    $("#loading-spinner").hide(); // Hide the loading spinner
  }
};

const toggleTaskCompletion = async (
  taskId,
  taskName,
  taskDescription,
  isCompleted
) => {
  $(".default-text").hide(); // Hide the default text
  $("#loading-spinner").show(); // Show the loading spinner
  $("#task-list").addClass("hidden");

  try {
    const response = await fetch(`${API_ENDPOINT}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: taskName,
        description: taskDescription,
        is_completed: isCompleted,
      }),
    });
    const task = await response.json();
    console.log("Task updated successfully:", task);
    getTasks();
  } catch (error) {
    console.error("Error updating task:", error);
    // Handle the error, like displaying an error message
  } finally {
    $("#loading-spinner").hide(); // Hide the loading spinner
  }
};
