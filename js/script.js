const getItems = () => JSON.parse(localStorage.getItem("wnsdnn_todoList")) ?? [];
const setItems = (todo) => localStorage.setItem("wnsdnn_todoList", JSON.stringify(todo));
const todoList = getItems();

function todoControllStatusUpdate() {
    const footer = document.querySelector("footer.footer");
    const todoCount = document.querySelector(".todo-count");
    const completedClearBtn = document.querySelector(".clear-completed");
    const todoLen = todoList.length;
    const todoCnt = todoList.filter(d => !d.active).length;
    const todoComCnt = todoList.filter(d => d.active).length;

    if (todoLen > 0) {
        footer.style.display = "block";
    } else {
        footer.style.display = "none";
    }

    if (todoComCnt > 0) {
        completedClearBtn.style.display = "block";
    } else {
        completedClearBtn.style.display = "none";
    }

    todoCount.textContent = `${todoCnt} items left`;
};

function todoActiveStatusUpdate() {
    const todoAllActive = todoList.every(d => d.active);
    const toggleChkInput = document.querySelector("#toggle-all");
    toggleChkInput.checked = todoAllActive;
};


function addTodo(todoTxt) {
    if(todoTxt === "") {
        alert("글씨를 처적고 엔터를 좀 누르세요.. 빡대가리야..");
        return;
    } else if(todoTxt.trim() === "") {
        alert("띄어쓰기도 포함이다.. 빡대가리야..");
        return;
    }

    const num = todoList.length > 0 ? Math.max(...todoList.map(d => parseInt(d.num))) : 0;
    todoList.push({ txt: todoTxt, active: false, num: num+1 });

    setItems(todoList);
    render();
};


function render() {
    const todoListEle = document.querySelector("ul.todo-list");
    const editInput = document.querySelector("input.new-todo");
    const filtersBtn = document.querySelectorAll(".filters li a");
    const hash = window.location.hash.split("/");
    const hashVal = hash[1] ?? '';    
    const newList = [];

    filtersBtn.forEach(ele => ele.classList.remove("selected"));
    
    if(hashVal === '') {
        newList.push(...todoList);
        filtersBtn[0].classList.add("selected");
    } else if (hashVal === 'active') {
        const list = todoList.filter(d => !d.active);
        newList.push(...list);
        filtersBtn[1].classList.add("selected");
    } else if (hashVal === 'completed') {
        const list = todoList.filter(d => d.active);
        newList.push(...list);
        filtersBtn[2].classList.add("selected");
    }


    todoListEle.innerHTML = ``;
    newList.forEach(({txt, active, num}) => {
        const li = document.createElement("li");
        li.className = active ? 'completed' : '';
        li.innerHTML = `
            <div class="view" data-num="${num}">
                <input class="toggle" type="checkbox" ${active ? 'checked' : ''} />
                <label>${txt}</label>
                <button class="destroy"></button>
            </div>
        `;
        todoListEle.appendChild(li);
    });

    editInput.value = '';
    todoControllStatusUpdate();
    setItems(todoList);
};


function editKeyDownEvent({ key, target }) {
    if (key === "Enter") addTodo(target.value)
};


function toggleAllBtnClickEvent() {
    const toggleChkInput = document.querySelector("#toggle-all");
    const checked = toggleChkInput.checked;
    
    todoList.forEach(function(data) {
        data.active = !checked;
    });

    render();
};

function todoListClickEvent({ target, currentTarget }) {

    if (target.classList.contains("toggle")) {
        const num = target.closest(".view").dataset.num;
        todoList.forEach((data) => {
            if(data.num == num) data.active = !data.active
        })
        render();
        todoActiveStatusUpdate();
        return;
    }

    if (target.classList.contains("destroy")) {
        const num = target.closest(".view").dataset.num;
        todoList.forEach((data, idx) => {
            if(data.num == num) todoList.splice(idx, 1);
        })
        render();
        todoActiveStatusUpdate();
        return;
    }
};

function completedClearBtnClickEvent() {
    const newList = todoList.filter(d => !d.active);
    todoList.splice(0, todoList.length);
    todoList.push(...newList);

    render();
    todoControllStatusUpdate();
};

function handleHashChange() {
    render();
}


window.onload = function() {
    render();
    todoActiveStatusUpdate();

    const todoListEle = document.querySelector("ul.todo-list");
    const editInput = document.querySelector("input.new-todo");
    const toggleAllBtn = document.querySelector("label[for='toggle-all']");
    const completedClearBtn = document.querySelector(".clear-completed");
    
    editInput.addEventListener("keydown", editKeyDownEvent);
    toggleAllBtn.addEventListener("click", toggleAllBtnClickEvent);
    completedClearBtn.addEventListener("click", completedClearBtnClickEvent);
    todoListEle.addEventListener("click", todoListClickEvent);
    window.addEventListener('hashchange', handleHashChange);
};