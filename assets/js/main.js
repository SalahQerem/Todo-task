const addTodoForm = document.querySelector(".add-todo-form");
const descriptionInput = document.querySelector("#todo-description");
const addTodoBtn = document.querySelector(".add-todo-btn");
const todosBody = document.querySelector("#todos-body");

const getTodosFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos"));
};

const setTodosToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos();
};

const displayTodos = () => {
  const todos = getTodosFromLocalStorage();
  let renderedTodos = "";
  todos.forEach((todo, index) => {
    renderedTodos += `<tr>
        <th scope="row">${index + 1}</th>
        <td>${todo.todo}</td>
        <td>${todo.userId}</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td>
            <div class="btn-container">
                <button class="btn btn-danger fw-semibold delete-btn" onclick="deleteTodo(${
                  todo.id
                })">Delete</button>
                <button class="btn btn-success fw-semibold confirm-btn" onclick="completeTodo(${
                  todo.id
                })">Done</button>
            </div>
        </td>
    </tr>`;
  });
  todosBody.innerHTML = renderedTodos;
};

const getTodos = async () => {
  if (!getTodosFromLocalStorage) {
    const res = await fetch("https://dummyjson.com/todos");
    const { todos } = await res.json();
    setTodosToLocalStorage(todos);
  } else {
    displayTodos();
  }
};

getTodos();

const addTodo = (e) => {
  e.preventDefault();
  let todos = getTodosFromLocalStorage();
  const todo = {
    id: todos.length + 1,
    todo: descriptionInput.value,
    userId: 2,
    completed: false,
  };
  todos = [todo, ...todos];
  setTodosToLocalStorage(todos);
  addTodoForm.reset();
};

const deleteTodo = (id) => {
  let todos = getTodosFromLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.id !== id);
  setTodosToLocalStorage(filteredTodos);
};

const completeTodo = (id) => {
  let todos = getTodosFromLocalStorage();
  todos.forEach((todo) => {
    if (todo.id === id) todo.completed = true;
  });
  setTodosToLocalStorage(todos);
};

addTodoBtn.addEventListener("click", addTodo);
