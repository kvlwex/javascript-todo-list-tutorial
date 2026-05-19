import test from "node:test";
import assert from "node:assert/strict";
import { countActive, initialModel, selectVisibleTodos, update } from "../src/state.js";

test("add creates a todo with trimmed title", () => {
  const model = update(initialModel, { type: "add", title: "  Learn TEA  ", now: 1 });

  assert.equal(model.todos.length, 1);
  assert.equal(model.todos[0].title, "Learn TEA");
  assert.equal(model.todos[0].completed, false);
});

test("add ignores empty title", () => {
  const model = update(initialModel, { type: "add", title: "   " });

  assert.equal(model.todos.length, 0);
});

test("toggle changes completion status", () => {
  const withTodo = update(initialModel, { type: "add", title: "Test task", now: 1 });
  const toggled = update(withTodo, { type: "toggle", id: withTodo.todos[0].id });

  assert.equal(toggled.todos[0].completed, true);
});

test("rename updates todo title and removes todo when title is empty", () => {
  const withTodo = update(initialModel, { type: "add", title: "Old", now: 1 });
  const renamed = update(withTodo, { type: "rename", id: withTodo.todos[0].id, title: "New" });
  const removed = update(renamed, { type: "rename", id: withTodo.todos[0].id, title: " " });

  assert.equal(renamed.todos[0].title, "New");
  assert.equal(removed.todos.length, 0);
});

test("filters visible todos", () => {
  const model = {
    filter: "completed",
    todos: [
      { id: "1", title: "Done", completed: true },
      { id: "2", title: "Open", completed: false }
    ]
  };

  assert.deepEqual(selectVisibleTodos(model).map((todo) => todo.title), ["Done"]);
  assert.equal(countActive(model.todos), 1);
});
