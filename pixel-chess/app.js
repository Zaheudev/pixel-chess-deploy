const express = require("express");
const http = require("http");
const path = require("path");
const {Chess} = require("chess.js");
const ws = require("ws");
const indexRouter = require("./routes/index");
const Game = require("./game.js");
const status = require("./statTracker");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));
app.set("views",path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.get("/", indexRouter);
app.get("/play", indexRouter);

const wsServer = new ws.Server({port:8080});

var currentGames = new Map();
var websockets = new Map();
var connectionID = 0;

wsServer.on("connection", function(ws) {
  let con = ws;
  con.id = connectionID++;

  if (currentGames.size != 0) {
    let gameFound = false;
    //loop through existing games, try to find a game with a player waiting
    for (const [id, game] of currentGames) {
      if (game.getWsBlack() === null && game.getState() === "Waiting") {
        game.setWsBlack(con);
        websockets.set(con.id, game);
        gameFound = true;
        console.log("Game found, joining game running " + id);
        game.setState("Started");
        //TODO Start game, send messages to players
        break;
      }
      //game not found, creating a new one
    }if(gameFound == false){
      console.log("No free game found, creating new game!")
      let newGame = new Game(new Chess(),con, status.gamesInitialized++);
      currentGames.set(newGame.getId(), newGame);
      websockets.set(con.id, newGame);
    }//if no games running, create new game
  }else {
    console.log("No games running, creating new game!")
    let newGame = new Game(new Chess(),con, status.gamesInitialized++);
    currentGames.set(newGame.getId(), newGame);
    websockets.set(con.id, newGame); 
  }

  ws.on("message", function(message) {
    console.log(message);
    let msg = message.split(";");
    let currentGame = websockets.get(con.id);

    //only accept moves if gameState = Started
    console.log(currentGame.getState());
    if(currentGame.getState() === "Started") {
      if ((currentGame.getWsWhite() === con && currentGame.getChess().turn() === 'w') ||
      (currentGame.getWsBlack() === con && currentGame.getChess().turn() === 'b')) {
        if (currentGame.chess.move({from:msg[0],to:msg[1]}) != null){
          console.log(currentGame.chess.ascii());
        }else {
          //TODO Send client invalid move message!
          console.log("Invalid move, try again!");
        }
      }else {
        console.log("Player tried to move for the other. CHEATER!");
      }
    }
  })

  ws.on("close", function(code) {
    console.log(con.id + " has closed the connection" );
    let currentGame = websockets.get(con.id);

    if(currentGame.getState() != "Waiting") {
      try {
        currentGame.getWsWhite().close();
        currentGame.setWsWhite(null);
      }catch (e) {
        console.log("Black is closing " + e);
        currentGame.setState("White");
      }
      try {
        currentGame.getWsBlack().close();
        currentGame.setWsBlack(null)
      }catch (e) {
        console.log("White is closing " + e);
        currentGame.setState("Black");
      }
    }else {
      //canceled
      currentGame.setState("Aborted");
    }
    //TODO send GAME OVER message to client
    if(currentGame.getState() != "Started"){
      console.log(currentGame.getState());
    }

  })

})
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