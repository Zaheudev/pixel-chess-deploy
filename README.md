# pixel-chess (WIP)
An online chess game created with Node.js and Websockets

## Initial mockups
### Splash
![SplashScreen](chesssplash.jpeg)
### Game
![GameScreen](chessgame.jpeg)

## Known Bugs
### Server
- [ ] When a player disconnects, the winning player is not correctly determined and the win message is not sent.
- [ ] No websocket heartbeat implementation to abort games when player disconnects unexpectedly. 
- [ ] Aborted/completed games are not cleaned up from the currentGames array. 
### Client
- [ ] When hovering over Cell A8, the chess table moves very slightly to the right.
Has to do with it being the 1st cell in the table, thus when hovering over it,
its position becomes absolute, taking it out of the flow. (*Potential fix: adding additional invisible cells*)
- [x] When in check, if trying to make a move, if that move is invalid, the red background behind the king still disappears.
(Fix: Receive possible moves from server and disable all other moves!)
- [ ] When castling, the position of the rook does not update on the screen.

## Credits
* Vel1khan
* Zaheu
* Ahmet Donmez (Planning & Mockup Design)
