const todosBody = document.querySelector("#todos-body");

const displayTodos = () => {
  const todos = JSON.parse(localStorage.getItem("todos"));
  let renderedTodos = "";
  todos.forEach((todo) => {
    renderedTodos += `<tr>
        <th scope="row">${todo.id}</th>
        <td>${todo.todo}</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td>${todo.userId}</td>
        <td>
            <div class="btn-container">
                <button class="btn btn-danger fw-semibold delete-btn">Delete</button>
                <button class="btn btn-success fw-semibold confirm-btn">Done</button>
            </div>
        </td>
    </tr>`;
  });
  todosBody.innerHTML = renderedTodos;
};

const getTodos = async () => {
  const res = await fetch("https://dummyjson.com/todos");
  const { todos } = await res.json();
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos();
};

getTodos();
