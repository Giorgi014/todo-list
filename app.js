const FORM = document.querySelector("form");
const TODO_INPUT = document.getElementById("todo_input");
const TODO_LIST = document.getElementById("todo");


const getTodoApi = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");

    // return await res.json();
    console.log(await res.json());
    
}

getTodoApi();


FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  todoAdd();
  updateTodoList();
  saveTodos();
});

const todoAdd = () => {
  const todoText = TODO_INPUT.value.trim();

  if (todoText.length > 0) {
    const objectTodo = {
      text: todoText,
      completed: false,
    };
    allTodos.push(objectTodo);
    TODO_INPUT.value = "";
  }
};
const updateTodoList = () => {
  TODO_LIST.innerHTML = "";
  allTodos.forEach((todo, todoIndex) => {
    todoItem = creatTodoItem(todo, todoIndex);
    TODO_LIST.append(todoItem);
  });
};
const creatTodoItem = (todo, todoIndex) => {
  const todoID = "todo_" + todoIndex;
  const todoDiv = document.createElement("div");
  const todoText = todo.text;
  todoDiv.className = "todo";
  todoDiv.innerHTML = `
                    <div id="todo">
                <input type="checkbox" class="${todoID}">
            <label for="${todoID}" class="custom_checkbox">
                <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
            </label>
            <label for="${todoID}" id="todo_text">
            ${todoText}
            </label>
            <button class="delete_button">
                <svg fill="azure" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
            </div>
                  `;
  const deleteButton = todoDiv.querySelector(".delete_button");
  deleteButton.addEventListener("click", () => {
    deleteTodoItem(todoIndex);
  });
  const checkbox = todoDiv.querySelector("input");
  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  checkbox.checked = todo.completed;
  return todoDiv;
};
const deleteTodoItem = (todoIndex) => {
  allTodos = allTodos.filter((_, i) => i !== todoIndex);
  saveTodos();
  updateTodoList();
};

const saveTodos = () => {
  const todosJson = JSON.stringify(allTodos);
  localStorage.setItem("todos", todosJson);
};

const getTodos = () => {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
};
let allTodos = getTodos();
updateTodoList();
