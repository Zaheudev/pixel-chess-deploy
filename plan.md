# Plan Outline
## message-types
1. **game-start** - server -> client [X]
1. **player-type** - server -> client [X]
1. **turn** - server -> client [X]
1. **game-move** - client -> server 
1. **move-valid** - server -> client [X]
1. **player-disconnect** - server -> client
1. **game-lose** - server -> client [X]
1. **game-win** - server -> client [X]

## client-ws-js 
1. "Waiting for player"
1. on **game-start** "Player found"
1. on **player-type**, send message, flip board if needed
1. on **turn** "enable/disable moves"
1. game-move client-validation 
1. on **move-valid** update board
1. on **game-lose/win** display message, return to menu 
1. on **player-disconnect**, display disconnect message, return to menu 

## server-ws-js 
1. on connection, if game object, players < 2, create new game object [X]
1. else assign websocket to existing game object, send start-game to both players [X]
1. coin-flip random, swap ws-white, ws-black if needed, send player-type message [X]
1. send turn message to white  [X]
1. while(!game-over)
1. check if .turn(), validate turn, send turn-valid to player [X]
1. send turn message to other player [X]
1. on **game-win**, send win to winner, lose to loser (replay option) [X]
1. on **player-disconnect** send disconnect message to remaining player [FAIL]

## splash-screen
1. EJS template with game status embedded (games started, games aborted, etc)
1. CSS layout for splash screen, download royalty free images
1. CSS animations
1. Dark Mode

## game-screen
1. After pressing play now, connect to websocket server
1. Display "Waiting for player"
1. Display quit button
1. Display chess-board, place pieces on chess-board
1. Display pieces lost/won
1. Display move history window
1. On start message, display, "Player connected, game started" for 5 seconds
1. On player-type message, display "You are {color}", flip board if needed
1. Display & Start timer, synchronise with server every 5 seconds
1. On turn message, enable clicking chessboard cells
1. On move, play move sound, move piece image on board
1. On invalid message, display "Invalid MOVE!"
1. On valid move, disable clicking chessboard cells, update move history window
1. On piece taken, hide piece from board, add to piece lost/won window
1. On draw message, display "DRAW"
1. On checkmate, display "[Winning color] wins"
1. On quit button, close connection to server
1. On player-disconnected message display "Player disconnected, [Player color] wins"
1. Dark Mode
