let todos = JSON.parse(localStorage.getItem("todos")) || [];

const todoList = document.getElementById("todo-list");
const newTodo = document.getElementById("new-todo");
const clearCompleted = document.getElementById("clear-completed");
const completed = document.getElementById("completed");
const all = document.getElementById("all");
const active = document.getElementById("active");
let currentFilter = "all";
let editingId = null;
const itemsLeft = document.getElementById("items-left");

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("span");
let currentTheme = localStorage.getItem("currentTheme") || "light";

if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.textContent = "☀️";
}
themeToggle.addEventListener("click", () => {
    if (currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.textContent = "☀️";
        currentTheme = "dark";
    } else if (currentTheme === "dark") {
        document.documentElement.removeAttribute("data-theme");
        themeIcon.textContent = "🌙";
        currentTheme = "light";
    }
    localStorage.setItem("currentTheme", currentTheme);
});

newTodo.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTodo(newTodo.value);
    }
});

//Add Function//
function addTodo(todoName) {
    if (todoName.trim() === "") {
        return;
    }
    const todoObject = {
        id: Date.now(),
        text: todoName.trim(),
        completed: false
    };
    todos.push(todoObject);
    saveTodo();
    newTodo.value = "";
    render();
}
//Render Function
function render() {
    todoList.innerHTML = "";
    const activeCount = todos.filter((todo) => !todo.completed).length;
    itemsLeft.textContent = activeCount;
    let todoFilter = todos;
    if (currentFilter === "active") {
        todoFilter = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
        todoFilter = todos.filter((todo) => todo.completed);
    }

    todoFilter.forEach((todo) => {
        const li = document.createElement("li");
        li.classList.add("todo-item");
        li.classList.toggle("completed", todo.completed);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;
        li.appendChild(checkbox);

        checkbox.addEventListener("change", () => {
            todo.completed = checkbox.checked;
            saveTodo();
            render();
        });

        let editInput = null;

        if (todo.id === editingId) {
            const textInput = document.createElement("input");
            textInput.type = "text";
            textInput.value = todo.text;
            textInput.classList.add("edit-input");
            textInput.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    editingId = null;
                    render();
                } else if (e.key === "Enter") {
                    const varInput = textInput.value.trim();
                    if (varInput === "") {
                        return;
                    }
                    todo.text = varInput;
                    editingId = null;
                    saveTodo();
                    render();
                }
            });
            li.appendChild(textInput);
            editInput = textInput;
        } else {
            const span = document.createElement("span");
            span.textContent = todo.text;
            span.classList.add("todo-text");
            li.appendChild(span);
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", (e) => {
            editingId = todo.id;
            render();
        });
        li.appendChild(editBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.dataset.id = todo.id;
        delBtn.classList.add("delete-btn");
        delBtn.addEventListener("click", (e) => {
            deleteTodo(e.currentTarget.dataset.id);
        });
        li.appendChild(delBtn);

        todoList.appendChild(li);
        if (editInput) {
            editInput.focus();
        }
    });
}

//Delete Function
function deleteTodo(todoId) {
    todos = todos.filter((todo) => todo.id !== Number(todoId));
    editingId = null;
    saveTodo();
    render();
}

//Clear Completed Todos Function
clearCompleted.addEventListener("click", (e) => {
    clearCompletedTodos();
});
function clearCompletedTodos() {
    todos = todos.filter((todo) => !todo.completed);
    saveTodo();
    render();
}

//Filter Todos Function
all.addEventListener("click", (e) => {
    filterTodos("all");
});
completed.addEventListener("click", (e) => {
    filterTodos("completed");
});
active.addEventListener("click", (e) => {
    filterTodos("active");
});
function filterTodos(filterType) {
    currentFilter = filterType;

    if (filterType === "all") {
        all.classList.add("active");
        completed.classList.remove("active");
        active.classList.remove("active");
    } else if (filterType === "completed") {
        all.classList.remove("active");
        completed.classList.add("active");
        active.classList.remove("active");
    } else if (filterType === "active") {
        all.classList.remove("active");
        completed.classList.remove("active");
        active.classList.add("active");
    }
    render();
}

//SaveTodos Function
function saveTodo() {
    localStorage.setItem("todos", JSON.stringify(todos));
}
render();
