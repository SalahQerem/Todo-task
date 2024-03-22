const displayTodos = () => {
  const todos = JSON.parse(localStorage.getItem("todos"));
  console.log(todos);
};

const getTodos = async () => {
  const res = await fetch("https://dummyjson.com/todos");
  const todos = await res.json();
  localStorage.setItem("todos", JSON.stringify(todos));
  displayTodos();
};

getTodos();
