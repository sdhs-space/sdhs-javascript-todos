const $ = (element) => document.querySelector(element);
const $$ = (element) => [...document.querySelectorAll(element)];
const createElement = (element, attrs = {}) => Object.assign(document.createElement(element), attrs);
const createHTML = (innerHTML, attrs = {}) => Object.assign(createElement("div", { innerHTML }).firstElementChild, attrs);
const elementDisplay = (element, isDisplay) => (element.style.display = isDisplay ? "block" : "none");

const getStorage = (storageName, initState) => JSON.parse(localStorage.getItem(storageName)) || initState;
const setStorage = (storageName, storageDatas) => localStorage.setItem(storageName, JSON.stringify(storageDatas));

const textTrim = (text) => text.trim();
const isTextEmpty = (text) => textTrim(text).length === 0;
const isKeyEnter = (keyEvent) => keyEvent.key === "Enter";

HTMLElement.prototype.find = function (element) {
  return this.querySelector(element);
};

class TodoApp {
  #storageName;
  #todoList;
  #todoIndex;

  static #FilterBy = {
    active: (todo) => !todo.completed,
    completed: (todo) => todo.completed,
  };

  constructor(storageName) {
    const { todoList, todoIndex } = getStorage(storageName, { todoList: [], todoIndex: 0 });
    this.#storageName = storageName;
    this.#todoList = todoList;
    this.#todoIndex = todoIndex;
  }

  #initTodos(changeTodoList = []) {
    this.#todoList = changeTodoList;
    setStorage(this.#storageName, { todoList: this.#todoList, todoIndex: this.#todoIndex });
    rendering();
  }

  get todos() {
    const currentFilter = location.hash.split("/")[1];
    const filterBy = TodoApp.#FilterBy[currentFilter];
    return filterBy ? this.#todoList.filter(filterBy) : this.#todoList;
  }

  addTodo({ name }) {
    return this.#initTodos([...this.#todoList, new TodoItem({ id: ++this.#todoIndex, name })]);
  }
  removeTodo({ id }) {
    return this.#initTodos(this.#todoList.filter((todo) => todo.id !== id));
  }
  removeCompletedTodo() {
    return this.#initTodos(this.#todoList.filter((todo) => !todo.completed));
  }

  changeTodo({ index, ...todo }) {
    return this.#initTodos(this.#todoList.with(index, TodoItem.init({ ...todo })));
  }

  get existTodos() {
    return this.#todoList.length > 0;
  }
}
class TodoItem {
  static init = (todo) => new TodoItem(todo);
  constructor({ id, name, completed = false, editing = false }) {
    this.id = id;
    this.name = name;
    this.completed = completed;
    this.editing = editing;
  }
}

const todoApp = new TodoApp("sdhs-todos");
const $newTodo = $(".new-todo");
const $main = $(".main");
const $todoList = $(".todo-list");
const $filters = $$(".filters li");

$newTodo.addEventListener("keydown", function (event) {
  if (!isKeyEnter(event)) return;
  if (isTextEmpty(this.value)) return alert("텍스트를 입력해주세요");
  todoApp.addTodo({ name: this.value });
  this.value = "";
});
window.addEventListener("hashchange", rendering);

class $TodoItem {
  static create = (todo, index) => new $TodoItem(todo, index);
  static setup = ({ $todoItem, todo, index }) => {
    const $checkbox = $todoItem.find(".toggle");
    const $label = $todoItem.find("label");
    const $destroy = $todoItem.find(".destroy");
    const $editInput = $todoItem.find(".edit");
    $label.textContent = todo.name;
    $editInput.value = todo.name;
    todo.editing && setTimeout(() => $editInput.focus());

    $destroy.addEventListener("click", () => todoApp.removeTodo({ id: todo.id }));
    $checkbox.addEventListener("change", () => todoApp.changeTodo({ index, ...todo, completed: $checkbox.checked }));
    $label.addEventListener("dblclick", () => todoApp.changeTodo({ index, ...todo, editing: true }));
    $editInput.addEventListener("blur", () => {
      if (isTextEmpty($editInput.value)) return todoApp.removeTodo({ id: todo.id });
      todoApp.changeTodo({ index, ...todo, name: $editInput.value, editing: false });
    });
    $editInput.addEventListener("keydown", (event) => {
      if (!isKeyEnter(event)) return;
      if (isTextEmpty($editInput.value)) return todoApp.removeTodo({ id: todo.id });
      todoApp.changeTodo({ index, ...tood, name: $editInput.value, editing: false });
    });

    return $todoItem;
  };
  constructor(todo, index) {
    this.todo = todo;
    this.index = index;
    this.$todoItem = createHTML(`
      <li class="${todo.completed ? "completed" : todo.editing ? "editing" : ""}">
        <div class="view">
          <input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""} />
          <label></label>
          <button class="destroy"></button>
        </div>
        <input class="edit" type="text"  />
      </li>
    `);
  }
}

function rendering() {
  elementDisplay($main, todoApp.existTodos);
  $todoList.innerHTML = ""; // 초기화

  const $todoItems = todoApp.todos.map($TodoItem.create).map($TodoItem.setup);
  $todoList.append(...$todoItems);
}

rendering();
