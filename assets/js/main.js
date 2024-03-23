const addTodoForm = document.querySelector(".add-todo-form");
const addTodoInput = document.querySelector("#todo-description");
const descriptionErrorMsg = document.querySelector(".description-error-msg");
const addTodoBtn = document.querySelector(".add-todo-btn");
const searchTodoInput = document.querySelector("#search-todo-input");
const todosBody = document.querySelector("#todos-body");
const totalTodosSpan = document.querySelector(".total-todos");
const deletionModal = document.querySelector(".delete-modal");
const confirmDeleteBtn = document.querySelector("#confirm-delete-btn");

const getTodosFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("todos"));
};

const setTodosToLocalStorage = (todos) => {
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos(todos);
};

const confirmActionDialog = (title) => {
  Swal.fire({
    position: "top-end",
    icon: "success",
    title,
    showConfirmButton: false,
    timer: 2000,
  });
};

const displayTodos = (todos) => {
  let renderedTodos = "";
  todos.forEach((todo, index) => {
    renderedTodos += `<tr>
        <th scope="row">${++index}</th>
        <td>${todo.todo}</td>
        <td>${todo.userId}</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td>
        <div class="btn-container">
            <button
                class="btn btn-danger fw-semibold delete-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onclick="showDeleteConfirmationModal(${todo.id})"
            >
                Delete
            </button>
            <button
                class="btn btn-success fw-semibold confirm-btn"
                onclick="completeTodo(${todo.id})"
            >
                Done
            </button>
        </div>
        </td>
    </tr>`;
  });
  todosBody.innerHTML = renderedTodos;
  totalTodosSpan.innerHTML = todos.length;
};

const getTodos = async () => {
  if (!getTodosFromLocalStorage()) {
    const res = await fetch("https://dummyjson.com/todos");
    const { todos } = await res.json();
    setTodosToLocalStorage(todos);
  } else {
    displayTodos(getTodosFromLocalStorage());
  }
};

getTodos();

const checkAddTodoInput = (e) => {
  const pattern = /^[A-Z][a-z]{10,100}$/;
  if (pattern.test(addTodoInput.value)) {
    if (addTodoInput.classList.contains("is-invalid")) {
      addTodoInput.classList.remove("is-invalid");
    }
    descriptionErrorMsg.style.cssText = "display:none;";
    addTodoInput.classList.add("is-valid");
    addTodoBtn.removeAttribute("disabled");
  } else {
    if (addTodoInput.classList.contains("is-valid")) {
      addTodoInput.classList.remove("is-valid");
    }
    descriptionErrorMsg.style.cssText = "display:block;";
    addTodoInput.classList.add("is-invalid");
    addTodoBtn.setAttribute("disabled", "disabled");
  }
};

const addTodo = async (e) => {
  e.preventDefault();
  let todos = getTodosFromLocalStorage();
  const todo = {
    id: todos.length + 1,
    todo: addTodoInput.value,
    userId: 2,
    completed: false,
  };

  todos = [todo, ...todos];
  setTodosToLocalStorage(todos);

  const res = await fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });

  if (res.status) {
    confirmActionDialog("Your Todo has been Added");
  }

  addTodoForm.reset();
  addTodoInput.classList.remove("is-valid");
};

const searchForTodo = (e) => {
  const todos = getTodosFromLocalStorage();
  const filteredTodos = todos.filter((todo) =>
    todo.todo.toLowerCase().startsWith(e.target.value.toLowerCase())
  );
  displayTodos(filteredTodos);
};

const showDeleteConfirmationModal = (id) => {
  confirmDeleteBtn.onclick = () => {
    deleteTodo(id);
  };
};

const deleteTodo = async (id) => {
  let todos = getTodosFromLocalStorage();
  const filteredTodos = todos.filter((todo) => todo.id !== id);

  const res = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "DELETE",
  });

  if (res.status === 200) {
    confirmActionDialog("Your Todo has been deleted");
  }
  setTodosToLocalStorage(filteredTodos);
};

const completeTodo = async (id) => {
  let todos = getTodosFromLocalStorage();
  todos.forEach((todo) => {
    if (todo.id === id) todo.completed = true;
  });

  const res = await fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: true,
    }),
  });

  if (res.status === 200) {
    confirmActionDialog("Your Todo has been Changed to completed");
  }
  setTodosToLocalStorage(todos);
};

addTodoBtn.addEventListener("click", addTodo);
searchTodoInput.addEventListener("keyup", searchForTodo);
addTodoInput.addEventListener("keyup", checkAddTodoInput);
