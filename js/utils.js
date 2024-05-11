export const showSpinner = () => {
  $("#loading-spinner").show();
};

export const hideSpinner = () => {
  $("#loading-spinner").hide();
};

export const showTaskList = () => {
  $("#task-list").removeClass("hidden");
};

export const hideTaskList = () => {
  $("#task-list").addClass("hidden");
};

export const showDefaultText = () => {
  $(".default-text").show();
};

export const hideDefaultText = () => {
  $(".default-text").hide();
};

export const clearTaskList = () => {
  $("#task-list").empty();
};
