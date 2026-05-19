export const filters = {
  all: "all",
  active: "active",
  completed: "completed"
};

export const initialModel = {
  todos: [],
  filter: filters.all
};

export function createTodo(title, now = Date.now()) {
  return {
    id: `${now}-${Math.random().toString(16).slice(2)}`,
    title: title.trim(),
    completed: false,
    createdAt: now
  };
}

export function normalizeFilter(filter) {
  return Object.values(filters).includes(filter) ? filter : filters.all;
}

export function update(model, message) {
  switch (message.type) {
    case "add": {
      const title = message.title.trim();
      if (!title) {
        return model;
      }

      return {
        ...model,
        todos: [createTodo(title, message.now), ...model.todos]
      };
    }

    case "toggle":
      return {
        ...model,
        todos: model.todos.map((todo) =>
          todo.id === message.id ? { ...todo, completed: !todo.completed } : todo
        )
      };

    case "rename": {
      const title = message.title.trim();
      if (!title) {
        return {
          ...model,
          todos: model.todos.filter((todo) => todo.id !== message.id)
        };
      }

      return {
        ...model,
        todos: model.todos.map((todo) => (todo.id === message.id ? { ...todo, title } : todo))
      };
    }

    case "remove":
      return {
        ...model,
        todos: model.todos.filter((todo) => todo.id !== message.id)
      };

    case "clearCompleted":
      return {
        ...model,
        todos: model.todos.filter((todo) => !todo.completed)
      };

    case "setFilter":
      return {
        ...model,
        filter: normalizeFilter(message.filter)
      };

    default:
      return model;
  }
}

export function selectVisibleTodos(model) {
  if (model.filter === filters.active) {
    return model.todos.filter((todo) => !todo.completed);
  }

  if (model.filter === filters.completed) {
    return model.todos.filter((todo) => todo.completed);
  }

  return model.todos;
}

export function countActive(todos) {
  return todos.filter((todo) => !todo.completed).length;
}
