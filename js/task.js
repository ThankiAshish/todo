import { API_ENDPOINT } from "./constants.js";
import {
  showSpinner,
  hideSpinner,
  showTaskList,
  hideTaskList,
  showDefaultText,
  hideDefaultText,
  clearTaskList,
} from "./utils.js";

const getTasks = async () => {
  hideDefaultText();
  showSpinner();

  try {
    const response = await fetch(API_ENDPOINT);
    const tasks = await response.json();

    if (tasks.items.length === 0) {
      showDefaultText();
      hideTaskList();
    } else {
      hideDefaultText();
      clearTaskList();
      showTaskList();

      tasks.items.forEach((task) => {
        const taskCard = `
          <div class="card${
            task.is_completed ? " completed" : ""
          }" data-task-id="${task._id}">
            <div class="card-body">
              <h5 class="card-title">${task.title}</h5>
              <p class="card-text">${task.description}</p>
              <input type="hidden" value=${
                task.is_completed
              } id="task-completed"/>
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
    hideSpinner();
  }
};

const createTask = async (taskName, taskDescription) => {
  hideDefaultText();
  showSpinner();
  hideTaskList();

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
    hideSpinner();
  }
};

const updateTask = async (
  taskId,
  taskName,
  taskDescription,
  taskIsCompleted
) => {
  hideDefaultText();
  showSpinner();
  hideTaskList();

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
    hideSpinner();
  }
};

const deleteTask = async (taskId) => {
  hideDefaultText();
  showSpinner();
  hideTaskList();

  try {
    await fetch(`${API_ENDPOINT}/${taskId}`, { method: "DELETE" });
    console.log("Task deleted successfully");
    getTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
    // Handle the error, like displaying an error message
  } finally {
    hideSpinner();
  }
};

export { getTasks, createTask, updateTask, deleteTask };
