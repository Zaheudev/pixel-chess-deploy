message-types {
    game-start - server -> client
    player-type - server -> client
    turn - server -> client
    game-move - client -> server
    move-valid - server -> client
    player-disconnect - server -> client
    game-lose - server -> client
    game-win - server -> client
}

client-ws-js {
    1."Waiting for player"
    2. on game-start "Player found"
    3. on player-type, send message, flip board
    4. on turn "enable/disable moves"
    5. game-move client-validation
    6. on move-valid update board
    7. on game-lose/win display message, return to menu
    8. on player-disconnect, display disconnect message, return to menu
}

server-ws-js {
    1. on connection, if game object, players < 2, create new game object
    2. else assign websocket to existing game object, send start-game to both players
    3. coin-flip random, swap ws-white, ws-black if needed, send player-type message
    4. send turn message to white
    5. while(!game-over)
    6. check if .turn(), validate turn, send turn-valid to player
    7. send turn message to other player
    8. on win, send win to winner, lose to loser (replay option)
    9. on-disconnect send disconnect message to remaining player
}

Websocket {
    id:
    Map(id, game)
}

game {
    id:
    chess:
    ws-white:
    ws-black:
}

