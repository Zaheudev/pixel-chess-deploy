const express = require("express");
const http = require("http");
const path = require("path");
const {Chess} = require("chess.js");
const ws = require("ws");
const indexRouter = require("./routes/index");
const Game = require("./game.js");
const Status = require("./statTracker.js");
const Message = require("./messages.js")

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
var status = new Status();
var gamesInitialized = 0;

wsServer.on("connection", function(ws) {
  let con = ws;
  con.id = connectionID++;
  console.log("Completed: "+status.getCompleted());
  console.log("Started: "+status.getStarted());
  console.log("Aborted: " + status.getAborted());

  if (currentGames.size != 0) {
    let gameFound = false;
    //loop through existing games, try to find a game with a player waiting
    for (const [id, game] of currentGames) {
      if (game.getWsBlack() === null && game.getState() === "Waiting") {
        game.setWsBlack(con);
        websockets.set(con.id, game);
        gameFound = true;
        console.log("Game found, joining game running " + id);

        //coinflip to determine player color, send color message to each player
        let coinflip = Math.random(); //randint 0 <= x < 1
        if (coinflip <= 0.49) {
          game.swapSides();
        }
        game.getWsWhite().send(JSON.stringify(new Message("playerType", "White")));
        game.getWsBlack().send(JSON.stringify(new Message("playerType", "Black")));
        game.setState("Started");
        status.incStarted();
        game.getWsWhite().send(JSON.stringify(new Message("gameStart")));
        game.getWsBlack().send(JSON.stringify(new Message("gameStart")));
        game.getWsWhite().send(JSON.stringify(new Message("turn")));
        
        break;
      }
      //game not found, creating a new one
    }if(gameFound == false){
      console.log("No free game found, creating new game!")
      let newGame = new Game(new Chess(),con, gamesInitialized++);
      currentGames.set(newGame.getId(), newGame);
      websockets.set(con.id, newGame);
    }//if no games running, create new game
  }else {
    console.log("No games running, creating new game!")
    let newGame = new Game(new Chess(),con, gamesInitialized++);
    currentGames.set(newGame.getId(), newGame);
    websockets.set(con.id, newGame); 
  }

  ws.on("message", function(message) {
    console.log(message);
    let currentGame = websockets.get(con.id);

    //only accept moves if gameState = Started

    //TODO parse JSON messages from client (optional)
    //TODO block possibleMove requests from client if not their turn 
    console.log(currentGame.getState());
    if(currentGame.getState() === "Started") {
      if (message.includes(';')) {
        let msg = message.split(';');
        if ((currentGame.getWsWhite() === con && currentGame.getChess().turn() === 'w') ||
        (currentGame.getWsBlack() === con && currentGame.getChess().turn() === 'b')) {
          if (currentGame.getChess().move({from:msg[0],to:msg[1]}) != null){
            console.log(currentGame.getChess().ascii());
            con.send(JSON.stringify(new Message("validity","valid")));

            //TODO check if in check, send message

            //check for GAME OVER after move
            if (currentGame.getChess().game_over()) {
              status.incCompleted();
              if (currentGame.getChess().in_checkmate()) {
                if (con === currentGame.getWsWhite()) {
                  currentGame.setState("White");
                  currentGame.getWsWhite().close();
                  currentGame.getWsBlack().close();
                }else {
                  currentGame.setState("Black");
                  currentGame.getWsWhite().close();
                  currentGame.getWsBlack().close();
                }
              }

            //check for DRAW after move
            else if (currentGame.getChess().in_draw() || currentGame.getChess().in_stalemate() || 
            currentGame.getChess().in_threefold_repetition() || currentGame.getChess().insufficient_material()){
              currentGame.setState("Draw");
              status.incCompleted();
              currentGame.getWsWhite().send(JSON.stringify(new Message("draw")));
              currentGame.getWsBlack().send(JSON.stringify(new Message("draw")));
              currentGame.getWsWhite().close();
              currentGame.getWsBlack().close();
            }
            if (currentGame.getChess().turn() === 'w') {
              currentGame.getWsWhite().send(JSON.stringify(new Message("turn")));
            }else {
              currentGame.getWsBlack().send(JSON.stringify(new Message("turn")));
            }
          }else {
            //Send client invalid move message!
            console.log("Invalid move!");
            con.send(JSON.stringify(new Message("validity","invalid")));
          }
        }else {
          //Send client who tried to made a move for the opponent an invalid message
          console.log("Player tried to move for the other. CHEATER!");
          con.send(JSON.stringify(new Message("validity","invalid")));
        }
      }
    }else {
      con.send(JSON.stringify((new Message("possibleMoves",currentGame.getChess().moves({ square: message, verbose: true})))));
    }
  }
})
  let disconnected = false;
  ws.on("close", function(code) {
    console.log(con.id + " has closed the connection" );
    let currentGame = websockets.get(con.id);
    
      if(currentGame.getState() != "Waiting") {
       if(con === currentGame.getWsWhite()) {
         currentGame.getWsBlack().close();
         currentGame.setState('Black');
       }
       else {
         currentGame.getWsWhite().close();
         currentGame.setState('White');
        } 
      }
    else {
      //canceled
      currentGame.setState("Aborted");
      status.incAborted();
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