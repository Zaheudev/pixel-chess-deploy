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
var disconnected = 0;

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
        //game.getWsWhite().send(JSON.stringify(new Message("turn")));
        let pieces = [];
              for(let move of game.getChess().moves({verbose:true})) {
                pieces.push(move.from);
              }
              game.getWsWhite().send(JSON.stringify(new Message("turn", pieces)));
        
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
    let clientMsg = JSON.parse(message);
    let currentGame = websockets.get(con.id);

    //only accept moves if gameState = Started
    console.log(currentGame.getState());
    if(currentGame.getState() === "Started") {
      switch (clientMsg.type) {
        case "move":
          let msg = clientMsg.data.split(';');
          if ((currentGame.getWsWhite() === con && currentGame.getChess().turn() === 'w') ||
          (currentGame.getWsBlack() === con && currentGame.getChess().turn() === 'b')) {
            if (currentGame.getChess().move({from:msg[0],to:msg[1]}) != null){
              console.log(currentGame.getChess().ascii());
              con.send(JSON.stringify(new Message("validity","valid")));
              if (con === currentGame.getWsWhite()) {
                currentGame.getWsBlack().send(JSON.stringify(new Message("opponentMove", {from:msg[0],to:msg[1]})));
              }else {
                currentGame.getWsWhite().send(JSON.stringify(new Message("opponentMove",{from:msg[0], to:msg[1]})));
              }
              //send turn message along with all possible moves (inefficient, only from field needs to be sent)
              if (con === currentGame.getWsWhite() && currentGame.getChess().turn() === 'b') {
                let pieces = [];
                for(let move of currentGame.getChess().moves({verbose:true})) {
                  pieces.push(move.from);
                }
                currentGame.getWsBlack().send(JSON.stringify(new Message("turn", pieces)));
              }else if (con === currentGame.getWsBlack() && currentGame.getChess().turn() === 'w') {
                let pieces = [];
                for(let move of currentGame.getChess().moves({verbose:true})) {
                  pieces.push(move.from);
                }
                currentGame.getWsWhite().send(JSON.stringify(new Message("turn", pieces)));
              }

              //check if in check, send message
              if (currentGame.getChess().in_check()) {
                if (con === currentGame.getWsWhite()) {
                  currentGame.getWsBlack().send(JSON.stringify(new Message("check")));
                }else {
                  currentGame.getWsWhite().send(JSON.stringify(new Message("check")));
                }
              }
              //check for GAME OVER after move
              if (currentGame.getChess().game_over()) {
                status.incCompleted();
                if (currentGame.getChess().in_checkmate()) {
                  if (con === currentGame.getWsWhite()) {
                    currentGame.setState("White");
                    currentGame.getWsWhite().send(JSON.stringify(new Message("You Won")));
                    currentGame.getWsBlack().send(JSON.stringify(new Message("You Lost")));
                    currentGame.getWsWhite().close();
                    currentGame.getWsBlack().close();
                    currentGames.delete(currentGame.getId());
                  }else {
                    currentGame.setState("Black");
                    currentGame.getWsBlack().send(JSON.stringify(new Message("You Won")));
                    currentGame.getWsWhite().send(JSON.stringify(new Message("You Lost")));
                    currentGame.getWsWhite().close();
                    currentGame.getWsBlack().close();
                    currentGames.delete(currentGame.getId());
                  }
                }

              //check for DRAW after move
              else if (currentGame.getChess().in_draw() || currentGame.getChess().in_stalemate() || 
              currentGame.getChess().in_threefold_repetition() || currentGame.getChess().insufficient_material()){
                currentGame.setState("Draw");
                status.incCompleted();
                currentGames.delete(currentGame.getId());
                currentGame.getWsWhite().send(JSON.stringify(new Message("draw")));
                currentGame.getWsBlack().send(JSON.stringify(new Message("draw")));
                currentGame.getWsWhite().close();
                currentGame.getWsBlack().close();
              }
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
          break;
    case "queryPossibleMoves":
      console.log("Sending moves!");
      if (con === currentGame.getWsWhite() && 'w' === currentGame.getChess().turn() ) {
        con.send(JSON.stringify((new Message("possibleMoves",currentGame.getChess().moves({ square: clientMsg.data, verbose: true})))));
      }
      else if (con === currentGame.getWsBlack() && 'b' === currentGame.getChess().turn()) {
        con.send(JSON.stringify((new Message("possibleMoves",currentGame.getChess().moves({ square: clientMsg.data, verbose: true})))));
      }
      break;
    }
  }
})

ws.on("close", function(code) {
    console.log(con.id + " has closed the connection" );
    let currentGame = websockets.get(con.id);

    if(currentGame.getState() != "Waiting") {
       if(con === currentGame.getWsWhite()) {
          currentGame.getWsBlack().send(JSON.stringify(new Message("opponentLeft")));
          currentGame.getWsBlack().close();
          currentGame.setState('Black');
          disconnected++;
        }
       else {
          currentGame.getWsWhite().send(JSON.stringify(new Message("opponentLeft")));
          currentGame.getWsWhite().close();
          currentGame.setState('White');
          disconnected++;
        }
      }
    else {
      //canceled
      currentGame.setState("Aborted");
      status.incAborted();
      currentGames.delete(currentGame.getId());
    }

    if(currentGame.getState() != "Started" && disconnected === 2){
      disconnected = 0;
      console.log(currentGame.getState());
      currentGames.delete(currentGame.getId());
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