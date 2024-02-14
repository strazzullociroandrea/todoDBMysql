const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const fs = require("fs");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const conf = JSON.parse(fs.readFileSync("conf.json"));
const connection = mysql.createConnection(conf);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (err, result) {
      if (err) {
        console.error(err);
        reject();
      }
      console.log("done");
      resolve(result);
    });
  });
};
const createTable = () => {
  return executeQuery(`
    CREATE TABLE IF NOT EXISTS todo
    ( id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    completed BOOLEAN )
  `);
};

createTable();
const insert = (todo) => {
  const template = `
    INSERT INTO todo (name, completed) VALUES ('$NAME', '$COMPLETED')
  `;
  let sql = template.replace("$NAME", todo.name);
  sql = sql.replace("$COMPLETED", todo.completed);
  return executeQuery(sql);
};

const select = () => {
  const sql = `
    SELECT id, name, completed FROM todo
  `;
  return executeQuery(sql);
};

const deleteTodo = (todoID) => {
  const sql = "DELETE FROM todo WHERE id=" + todoID;
  return executeQuery(sql);
};

const update = (todo) => {
  const sql = "UPDATE todo SET completed = 1 WHERE ID = " + todo.id;
  return executeQuery(sql);
};

let todos = [];

//app.post & app.get --> body-parser
app.use("/", express.static(path.join(__dirname, "public")));

//Servizio per salvare i todo su server
app.post("/salvaTodo", (request, response) => {
  const todo = request.body;
  insert(todo);
  response.json({ result: "ok" });
});

//Servizio per recuperare i todo su server
app.get("/recuperaTodo", (request, response) => {
  select().then((result) => response.json({ todo: result }));
});

//Servizio per eliminare i todo su server
app.delete("/eliminaTodo/:id", (request, response) => {
  deleteTodo(request.params.id)
    .then((res) => {
      response.json({ result: "OK" });
    })
    .catch((error) => response.json({ result: "Non presente" }));
});

//Servizio per aggiornare la todo su server
app.put("/completa", (request, response) => {
  const todo = request.body;
  update(todo)
    .then((res) => response.json({ result: "ok" }))
    .catch((error) => response.json({ result: "Non presente" }));
});

const server = http.createServer(app);
server.listen(80, () => {
  console.log("-> server running");
});
