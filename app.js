const FORM = document.querySelector("form");
const TODO_INPUT = document.getElementById("todo_input");
const TODO_LIST = document.getElementById("todo");


let allTodos = [];

const getTodoApi = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");

  return await res.json();
};

const renderTodo = (apiTodoList) => {
  // todo.map((listTodo) => {
  //   const todoList = creatTodoItem(listTodo);

  //   TODO_LIST.appendChild(todoList);
  // });

  const storageTodos = getTodos();

  allTodos = [...storageTodos, ...apiTodoList].map((item) => ({
    id: item.id,
    title: item.title,
    completed: item.completed,
  }));

  // apiTodoList.forEach((listTodo) => {
  //   const objectTodo = {
  //     title: listTodo.title,
  //     completed: listTodo.completed,
  //   };
  //   allTodos = [objectTodo, ...allTodos]
  //   allTodos.unshift(objectTodo);
  // });
  // saveTodos();
  // console.log(allTodos);
  
  updateTodoList(allTodos);
};

const debonce = (cd, delay = 1000) => {
  return (...args) => {
    setTimeout(() => {
      cd(...args)
    }, delay)
  }
}
const updateDebonce = debonce((text) => {
 const filter = allTodos.filter(todo => todo.title.toLowerCase().includes(text));
 updateTodoList(filter)
})

TODO_INPUT.addEventListener("input", (e) => {
  const inputValue = e.target.value.toLowerCase()

  if(inputValue === '') {
    renderHtml()
    return
  }
  // updateTodoList(allTodos.filter(todo => todo.title.toLowerCase().includes(inputValue)))
  updateDebonce(inputValue)
})

FORM.addEventListener("submit", (e) => {
  e.preventDefault();
  // todoAdd();
  saveTodos({
    id: self.crypto.randomUUID(),
    title: TODO_INPUT.value.trim(),
    completed: false,
  });

  // updateTodoList();
});

// const todoAdd = () => {
//   const todoText = TODO_INPUT.value.trim();

//   if (todoText.length > 0) {
//     const objectTodo = {
//       title: todoText,
//       completed: false,
//     };
//     allTodos.push(objectTodo);
    // TODO_INPUT.value = "";
//   }
// };
const updateTodoList = (updatedTodos) => {
  TODO_LIST.innerHTML = "";
  updatedTodos.forEach((todo, todoIndex) => {
    todoItem = creatTodoItem(todo, todoIndex, todo.id);
    TODO_LIST.append(todoItem);
  });
};
const creatTodoItem = (todo, todoIndex, todoId) => {
  const todoID = "todo_" + todoId ?? todoIndex;
  const todoDiv = document.createElement("div");
  // const todoText = todo.text;
  const todoText = todo.title;
  todoDiv.className = "todo";
  todoDiv.innerHTML = `
                    <div id="todo">
                <input type="checkbox" id="${todoID}" class="checkbox">
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
    console.log("in", todoId);
    
    deleteTodoItem(todoId);
  });
  const checkbox = todoDiv.querySelector("input");

  checkbox.addEventListener("change", () => {
    allTodos[todoIndex].completed = checkbox.checked;
    saveTodos();
  });
  checkbox.checked = todo.completed;
  return todoDiv;
};
const deleteTodoItem = (todoId) => {
  const localeTodos = getTodos();
  const updatedTodos = localeTodos.filter(todo => todo.id !== todoId)
  // allTodos = allTodos.filter((_, i) => i !== todoIndex);
  // saveTodos(updatedTodos);
  localStorage.setItem("todos", JSON.stringify(updatedTodos));
  renderHtml()
  // updateTodoList();
};

const saveTodos = (newTodo) => {
  // const storageTodos = getTodos()
  // const todosJson = JSON.stringify([newTodo, ...storageTodos]);
  // localStorage.setItem("todos", todosJson);

  // renderHtml();
  let saveTodos = [];

  if (newTodo) {
    saveTodos = [newTodo, ...getTodos()];
  } else {
    saveTodos = allTodos;
  }

  localStorage.setItem("todos", JSON.stringify(saveTodos));

  renderHtml();
};

const getTodos = () => {
  const todos = localStorage.getItem("todos") || "[]";
  return JSON.parse(todos);
};

// updateTodoList();

const renderHtml = async () => {
  try {
    const apiTodoList = await getTodoApi();
    renderTodo(apiTodoList);
  } catch (err) {
    console.log("Error: ", err);
  }
};


// todoAdd();
renderHtml();
