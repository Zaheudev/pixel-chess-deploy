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