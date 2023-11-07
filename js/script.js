const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs);

const textTrim = (text) => text.trim();
const isTextEmpty = (text) => textTrim(text).length === 0;
const isKeyEnter = (keyEvent) => keyEvent.key === "Enter";

function App() {
  const [$newTodo, $toggleAll, $todoList, $todoCount, $clearCompleted] = [
    ".new-todo",
    ".toggle-all",
    ".todo-list",
    ".todo-count",
    ".clear-completed",
  ].map($);

  const TodoStatus = Object.freeze({
    ACTIVE: "active",
    EDITING: "editing",
    COMPLETED: "completed",
  });

  const FilterBy = Object.freeze({
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed",
  });

  const state = {
    storageName: "todos",
    filterBy: FilterBy.ALL,
    todos: [],
  };

  $newTodo.addEventListener("keydown", function (event) {
    if (!isKeyEnter(event)) return;
    if (isTextEmpty(this.value)) return;
    state.todos = [...state.todos, { id: 0, name: this.value, status: TodoStatus.ACTIVE }];
  });
}

App();
