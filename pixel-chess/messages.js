/*Message types:
gameStart, none
possibleMoves, array of cells
playerType, string(black/white)
validity, string(valid/invalid)
turn, none
check, none
draw, none
win, none
lose, none
player-disconnect, none

*/

function Message (type, data) {
    this.type = type;
    this.data = data;
}

module.exports = Message;