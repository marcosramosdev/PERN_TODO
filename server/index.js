const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//todo Routes //

// Create
app.post("/todos", async function (req, res) {
  try {
    const description = req.body.description;

    const addNewTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1)",
      [description]
    );

    res.json(addNewTodo);
  } catch (error) {
    console.error(error.message);
  }
});

// Read and read by id
app.get("/todos", async function (req, res) {
  try {
    const todosArray = await pool.query("SELECT * FROM todo");
    res.json(todosArray.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/todos/:id", async function (req, res) {
  try {
    const { id } = req.params;
    const query = await pool.query("SELECT * FROM todo WHERE todo_id = ($1)", [
      id,
    ]);

    res.json(query.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Update by id

app.put("/todos/:id", async function (req, res) {
  try {
    const { description } = req.body;
    const { id } = req.params;

    console.log(description, id);
    const updateTodo = await pool.query(
      "UPDATE todo SET description = ($1) WHERE todo_id = ($2)",
      [description, id]
    );

    const updatedTodo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = ($1)",
      [id]
    );

    res.json(updatedTodo.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// Delete
app.delete("/todos/:id", async function (req, res) {
  try {
    const { id } = req.params;

    const todoToDelete = await pool.query(
      "SELECT * FROM todo WHERE todo_id = ($1)",
      [id]
    );

    const query = await pool.query("DELETE FROM todo WHERE todo_id = ($1)", [
      id,
    ]);

    res.json(`${todoToDelete.rows[0].description} foi deletado/concluido`);
  } catch (error) {
    console.error(error.message);
  }
});

app.listen(5000, () => {
  console.log("servidor rodando na porta 5000 ");
});
