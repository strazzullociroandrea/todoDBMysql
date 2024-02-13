const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
let todos = [];

//app.post & app.get --> body-parser
app.use("/", express.static(path.join(__dirname, "public")));

//Servizio per salvare i todo su server
app.post("/salvaTodo", (request, response) => {
  const todo = request.body;
  todo.id = new Date().getTime();
  todos.push(todo);
  response.json({ result: "ok" });
});

//Servizio per recuperare i todo su server
app.get("/recuperaTodo", (request, response) => {
  response.json({ todo: todos });
});

//Servizio per eliminare i todo su server
app.delete("/eliminaTodo/:id",(request, response)=>{
  const index = todos.findIndex(todo => todo.id == request.params.id);
  if(index != -1){
    todos.splice(index,1);
    response.json({result: "Ok"});
  }else{
    response.json({result: "Non presente"});
  }
});

//Servizio per aggiornare la todo su server
app.put("/completa",(request, response)=>{
  const todo = request.body;
  const index = todos.findIndex(todoa => todoa.id == todo.id);
  if(index != -1){
    todos[index]['completed'] = true;
    response.json({result: "ok"});
  }else{
    response.json({result: "Non presente"});
  }
})


const server = http.createServer(app);
server.listen(80, () => {
  console.log("-> server running");
});