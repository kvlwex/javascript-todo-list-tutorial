import { countActive, selectVisibleTodos } from "./state.js";

function renderTodo(todo) {
  return `
    <li class="todo-item ${todo.completed ? "is-completed" : ""}" data-id="${todo.id}">
      <label class="todo-check">
        <input class="todo-toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
        <span>${escapeHtml(todo.title)}</span>
      </label>
      <div class="todo-actions">
        <button class="icon-button" type="button" data-action="edit" aria-label="Редактировать задачу">
          ✎
        </button>
        <button class="icon-button danger" type="button" data-action="remove" aria-label="Удалить задачу">
          ×
        </button>
      </div>
    </li>
  `;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function render(model, elements) {
  const visibleTodos = selectVisibleTodos(model);
  const activeCount = countActive(model.todos);

  elements.list.innerHTML = visibleTodos.length
    ? visibleTodos.map(renderTodo).join("")
    : '<li class="empty-state">Здесь пока нет задач для выбранного фильтра.</li>';

  elements.counter.textContent = `${activeCount} ${pluralize(activeCount, "активная", "активные", "активных")}`;
  elements.clearCompleted.disabled = !model.todos.some((todo) => todo.completed);

  elements.filters.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.filter === model.filter);
  });
}

function pluralize(value, one, few, many) {
  const lastDigit = value % 10;
  const lastTwoDigits = value % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return few;
  }

  return many;
}
