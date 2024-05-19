import { getTasks, createTask, updateTask, deleteTask } from "./task.js";

$(document).ready(function () {
  getTasks();

  $("#new-task-btn").click(function () {
    $("#new-task-modal").modal("show");
  });

  $("#task-form").submit(function (e) {
    e.preventDefault();
    const taskName = $("#taskName").val();
    const taskDescription = $("#taskDescription").val();

    if (taskName === "" || taskDescription === "") {
      alert("Please fill in all fields");
      return;
    }
    createTask(taskName, taskDescription);
    $("#new-task-modal").modal("hide");

    $("#taskName").val("");
    $("#taskDescription").val("");
  });

  $(document).on("click", ".edit-task-btn", function () {
    var taskTitle = $(this).closest(".card").find(".card-title").text();
    var taskDescription = $(this).closest(".card").find(".card-text").text();
    var taskId = $(this).closest(".card").data("task-id");
    var isCompleted = $(this).closest(".card").find("#task-completed").text();

    $("#edit-task-form").attr("data-task-id", taskId);

    $("#editTaskName").val(taskTitle);
    $("#editTaskDescription").val(taskDescription);
    $("#editTaskIsCompleted").val(isCompleted);

    $("#edit-task-modal").modal("show");
  });

  $("#edit-task-form").submit(function (event) {
    event.preventDefault();

    const taskId = $(this).attr("data-task-id");
    var taskName = $("#editTaskName").val();
    var taskDescription = $("#editTaskDescription").val();
    var taskIsCompleted = $("#editTaskIsCompleted").val();

    if (taskName === "" || taskDescription === "") {
      alert("Please fill in all fields");
      return;
    }

    updateTask(taskId, taskName, taskDescription, taskIsCompleted);

    $("#edit-task-modal").modal("hide");

    $("#editTaskName").val("");
    $("#editTaskDescription").val("");
    $("#editTaskIsCompleted").val("");
  });

  $(document).on("click", ".delete-task-btn", function () {
    const taskId = $(this).attr("data-task-id");

    deleteTask(taskId);
  });

  $(".mark-as-completed-btn").click(function () {
    const taskId = $(this).attr("data-task-id");
    const isCompleted = $(this).is(":checked");
    updateTask(taskId, null, null, isCompleted);
  });

  $(document).on("click", ".mark-as-completed-btn", function () {
    var taskId = $(this).data("task-id");
    var taskTitle = $(this).closest(".card").find(".card-title").text();
    var taskDescription = $(this).closest(".card").find(".card-text").text();
    var taskId = $(this).closest(".card").data("task-id");
    var isCompleted = $(this).hasClass("completed");

    updateTask(taskId, taskTitle, taskDescription, !isCompleted);
  });

  $(".close").click(function () {
    $("#new-task-modal").modal("hide");
    $("#edit-task-modal").modal("hide");
  });
});
