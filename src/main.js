import { initialModel, update } from "./state.js";
import { readFilterFromLocation, ensureRoute } from "./router.js";
import { loadModel, saveModel } from "./storage.js";
import { render } from "./view.js";

const elements = {
  form: document.querySelector("[data-testid='todo-form']"),
  input: document.querySelector("[data-testid='todo-input']"),
  list: document.querySelector("[data-testid='todo-list']"),
  counter: document.querySelector("[data-testid='todo-counter']"),
  clearCompleted: document.querySelector("[data-testid='clear-completed']"),
  filters: document.querySelectorAll("[data-filter]")
};

let model = {
  ...loadModel(initialModel),
  filter: readFilterFromLocation(window.location)
};

function dispatch(message) {
  model = update(model, message);
  saveModel(model);
  render(model, elements);
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  dispatch({ type: "add", title: elements.input.value });
  elements.input.value = "";
  elements.input.focus();
});

elements.list.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");
  if (!item) {
    return;
  }

  if (event.target.matches(".todo-toggle")) {
    dispatch({ type: "toggle", id: item.dataset.id });
    return;
  }

  if (event.target.closest("[data-action='remove']")) {
    dispatch({ type: "remove", id: item.dataset.id });
    return;
  }

  if (event.target.closest("[data-action='edit']")) {
    const currentTodo = model.todos.find((todo) => todo.id === item.dataset.id);
    const nextTitle = window.prompt("Новое название задачи", currentTodo?.title ?? "");
    if (nextTitle !== null) {
      dispatch({ type: "rename", id: item.dataset.id, title: nextTitle });
    }
  }
});

elements.clearCompleted.addEventListener("click", () => {
  dispatch({ type: "clearCompleted" });
});

window.addEventListener("hashchange", () => {
  dispatch({ type: "setFilter", filter: readFilterFromLocation(window.location) });
});

ensureRoute(window.location);
render(model, elements);
