const express = require("express");
const http = require("http");
const indexRouter = require("./routes/index");
const path = require("path");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views",path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get("/", indexRouter);
app.get("/play", indexRouter);
/*
app.get('/', function(req,res) {
  const title = "Pixel Chess";
  const viewData = {
    title: title
  }
  res.render('index', viewData);
})
*/

//TODO: Error code pages using EJS templating
/*
app.use(function(req,res) {
  res.status(404).send("404: Page not Found!");
})
app.use(function(req,res) {
  res.status(500).send("500: Internal Server Error!")
})
*/



http.createServer(app).listen(port);
console.log("Server started on port " + port);