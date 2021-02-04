/*Message types:
gameStart, none
possibleMoves, array of cells
opponentMove, string
playerType, string(black/white)
validity, string(valid/invalid)
turn, none
check, none
draw, none
win, none
lose, none
player-disconnect, none

*/

function Message (type, data, moves) {
    this.type = type;
    this.data = data;
    this.possibleMoves = [];
    this.possibleCaptures = [];
    this.posMoves = function(moves) {
        for (let move of moves) {
            possibleMoves.push(move.to);
            if(move.flags === 'c' || move.flags === 'e') {
                possibleCaptures.push(move.to);
            }
        }
    }
}

module.exports = Message;