const storageKey = "college.todo-list.model";

export function loadModel(fallbackModel) {
  try {
    const rawModel = localStorage.getItem(storageKey);
    if (!rawModel) {
      return fallbackModel;
    }

    const parsedModel = JSON.parse(rawModel);
    return {
      ...fallbackModel,
      ...parsedModel,
      todos: Array.isArray(parsedModel.todos) ? parsedModel.todos : []
    };
  } catch {
    return fallbackModel;
  }
}

export function saveModel(model) {
  localStorage.setItem(storageKey, JSON.stringify(model));
}
