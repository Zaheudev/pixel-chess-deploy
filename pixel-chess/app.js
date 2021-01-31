const express = require("express");
const http = require("http");
const indexRouter = require("./routes/index");
const path = require("path");
const {Chess} = require("chess.js");
const ws = require("ws");
const { randomInt } = require("crypto");


const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views",path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get("/", indexRouter);
app.get("/play", indexRouter);

const currentGames = new Map(); 

const wsServer = new ws.Server({port:8080});
/*
wsServer.on('connection', function(ws) {
  console.log("Connected"+ws);
  let newGame = new Game(new Chess(), ws, randomInt(420));
  ws.on("message", function(message) {
    console.log(message);
    let msg = message.split(";");
    newGame.chess.move({from:msg[0],to:msg[1]})
    console.log(newGame.chess.ascii());
  }
)})
*/

wsServer.on("connection", function(ws) {
  if (currentGames.size != 0) {
    for (let game of currentGames) {
      if (game.getWsBlack() === null) {
        game.setWsBlack(new WebSocket(randomInt(1000),ws));
        //TODO Start game, send messages to players
        break;
      }
    }//TODO if no free games found, create new game
  }else {
    let newSocket = new WebSocket(randomInt(1000),ws);
    let newGame = new Game(new Chess(), newSocket);
    newSocket.setGame(newGame);
    currentGames.set(newGame.getId(), newGame);
  }
  ws.on("message", function(message) {
    console.log(message);
    let msg = message.split(";");
    let game = newSocket.getGame(); //?
    game.chess.move({from:msg[0],to:msg[1]})
    console.log(game.chess.ascii());
  })
})

function WebSocket(id,ws) {
  this.id = id;
  this.ws = ws;
  this.game = null;

  this.getGame = function() {
    return this.game;
  }
  this.setGame = function(game) {
    this.game = game;
  }
}

function Game(chess, wsWhite, id){
  this.id = id;
  this.chess = chess;
  this.wsWhite = wsWhite;
  this.wsBlack = null;

  this.setWsWhite = function(wsWhite){
    this.wsWhite = wsWhite;
  }

  this.getWsWhite = function() {
    return this.wsWhite;
  }

  this.setWsBlack = function(wsBlack){
    this.wsBlack = wsBlack;
  }
  
  this.getWsBlack = function() {
    return this.wsBlack;
  }

  this.getId = function(){
    return this.id;
  }
}

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
