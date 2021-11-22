const HOST = location.origin.replace(/^http/, 'ws');
// const client = new WebSocket("ws://localhost:8080");
const client = new WebSocket(HOST);

const board = document.querySelector(".chess-board");
const state = document.querySelector("#state h1");
const historyDiv = document.querySelector("#historyElements");
const turnText = document.querySelector("#turn");

var possiblePieces = [];
var possibleMoves = [];
var playerType = "";
var pieceCaptured = null;
var piecesGainedCounter = -1;
var piecesLostCounter = -1;

//reset all possibleMoves if another cell is selected!
//send move to server if possibleMove cell is selected after click on a piece
var pieceSelected = false;
var cell1 = null;
var cell2 = null;

/*Message types:
queryPossibleMoves, string
move, string
promotion, string
*/

//Message object to be used when sending websocket messages to server by parsing into JSON
function Message (type, data) {
    this.type = type;
    this.data = data;
}

// if(isPromoting){
//     document.querySelector(".chees-board")
// }

board.addEventListener('click', (e)=>{
    let imgCell = document.getElementById(e.target.id);
    if (e.target.nodeName === 'TD') {
        if (!pieceSelected) {
            if (possiblePieces.includes(e.target.id)){
                cell1 = e.target.id;
                console.log("Cell1 = "+cell1);
                //client.send(cell1);
                client.send(JSON.stringify(new Message("queryPossibleMoves",cell1)));
                pieceSelected = true;
                console.log(possible);
            }
        }else {
            if (possible.includes(e.target.id)) {
                cell2 = e.target.id;
                console.log("Cell2 = "+ cell2);
                
                if (cell1 != null && cell2 != null) {
                    console.log(cell1+";"+cell2);
                    for (move of possibleMoves) {
                        console.log(move);
                        if (cell1 === move.from && cell2 === move.to) {
                            //this is dumb and inconsistent with how we send normal moves but I can't be asked
                            if (move.flags.includes('p')) {
                                promote();
                            }else {
                                client.send(JSON.stringify(new Message("move",move)));
                            }
                            castling();
                            break;
                        }
                    }
                    //client.send(cell1+";"+cell2);
                    //client.send(JSON.stringify(new Message("move",cell1+";"+cell2)));
                    console.log("SENT!");
                    for (cellID of possible){
                        document.getElementById(cellID).style.backgroundColor = "";
                    }
                    possible = [];
                    pieceSelected = false;
                    if (playerType === "White") {
                        king = document.getElementById("white_king")
                    }
                    else if (playerType === "Black") {
                        king = document.getElementById("black_king")
                    }
                    king.style.backgroundColor = "";
                }
        }else {
            cell1 = null;
            cell2 = null;
            pieceSelected = false;
            for (cellID of possible){
                document.getElementById(cellID).style.backgroundColor = "";
            }
        }
        }
    }else if(e.target.nodeName === 'IMG'){
        console.log(imgCell.parentElement.id);
        if (!pieceSelected) {
            if (possiblePieces.includes(imgCell.parentElement.id)) {
                cell1 = e.target.parentElement.id;
                console.log("Cell1 = "+cell1);
                //client.send(cell1);
                client.send(JSON.stringify(new Message("queryPossibleMoves",cell1)));
                pieceSelected = true;
            }
        }else {
            if (possible.includes(imgCell.parentElement.id)) {
                cell2 = e.target.parentElement.id;
                console.log("Cell2 = "+ cell2);
                if (cell1 != null && cell2 != null) {
                    console.log(cell1+";"+cell2);
                    for (move of possibleMoves) {
                        console.log(move);
                        if (cell1 === move.from && cell2 === move.to) {
                            //this is dumb and inconsistent with how we send normal moves but I can't be asked
                            if (move.flags.includes('p')) {
                                promote();
                            }else {
                                client.send(JSON.stringify(new Message("move",move)));
                            }
                            castling();
                            break;
                        }
                    }
                    //client.send(JSON.stringify(new Message("move",cell1+";"+cell2)));
                    console.log("SENT!");
                    for (cellID of possible){
                        document.getElementById(cellID).style.backgroundColor = "";
                    }
                    possible = [];
                    pieceSelected = false;
                    if (playerType === "White") {
                        king = document.getElementById("white_king")
                    }
                    else if (playerType === "Black") {
                        king = document.getElementById("black_king")
                    }
                    king.style.backgroundColor = "";
                }
            }else {
                cell1 = null;
                cell2 = null;
                pieceSelected = false;
                for (cellID of possible){
                        document.getElementById(cellID).style.backgroundColor = "";
                }
            }
        }
    }
});

//TODO animate rotations
function flipBoard() {
    let tiles = document.querySelectorAll(".chess-board td img");
    let coords = document.querySelectorAll(".chess-board th");
    let whiteLetters = document.querySelectorAll("#white-letters th");
    let blackLetters = document.querySelectorAll("#black-letters th");
    board.style.transform = "rotateY(180deg) rotateX(180deg)";

    for (tile of tiles) {
        tile.style.transform = "rotateX(180deg) rotateY(180deg)";
    }
    for (coord of coords) {
        coord.style.transform = "rotateX(180deg) rotateY(180deg)";
    }
    for (let i=0; i < whiteLetters.length; i++) {
        blackLetters[i].innerHTML = whiteLetters[i].innerHTML;
        whiteLetters[i].innerHTML = "";
    }
    for (let i=1; i < 9; i++) {
        let orig = document.querySelector("#white"+i);
        let replace = document.querySelector("#black"+i);
        console.log(orig.innerHTML+" " + replace.innerHTML);
        replace.innerHTML = orig.innerHTML;
        orig.innerHTML = "";
    }
}

function castling(){
    if(move.flags.includes('k')){
        if(playerType === "White"){
            let oldRookCell = document.querySelector("#white_rook2").parentElement;
            let rookImg = oldRookCell.firstElementChild;
            let targetCell = document.querySelector("#"+possibleMoves[0].to);
            oldRookCell.removeChild(oldRookCell.firstElementChild);
            targetCell.appendChild(rookImg);
            client.send(JSON.stringify(new Message("move", {rookpos: possibleMoves[0].to, side: 'k', playerType: playerType})));
    }else{
            oldRookCell = document.querySelector("#black_rook2").parentElement;
            rookImg = oldRookCell.firstElementChild;
            targetCell = document.querySelector("#"+possibleMoves[0].to);
            oldRookCell.removeChild(oldRookCell.firstElementChild);
            targetCell.appendChild(rookImg);
            client.send(JSON.stringify(new Message("move", {rookpos: possibleMoves[0].to, side: 'k', playerType: playerType})));
        }
    }else if(move.flags.includes('q')){
        if(playerType === "White"){
            oldRookCell = document.querySelector("#white_rook1").parentElement;
            rookImg = oldRookCell.firstElementChild;
            targetCell = document.querySelector("#"+possibleMoves[0].to);
            oldRookCell.removeChild(oldRookCell.firstElementChild);
            targetCell.appendChild(rookImg);
            client.send(JSON.stringify(new Message("move", {rookpos: possibleMoves[0].to, side: 'q', playerType: playerType})));

        }else{
            oldRookCell = document.querySelector("#black_rook1").parentElement;
            rookImg = oldRookCell.firstElementChild;
            targetCell = document.querySelector("#"+possibleMoves[0].to);
            oldRookCell.removeChild(oldRookCell.firstElementChild);
            targetCell.appendChild(rookImg);
            client.send(JSON.stringify(new Message("move", {rookpos: possibleMoves[0].to, side: 'q', playerType: playerType})));
        }
    }
}

function promote() {
    let panel = document.querySelector("#center #promotionPanel");
    // let playerType;
    panel.style.display = "block";
    board.style.pointerEvents = "none";
    document.querySelector("#promoteQueen").onclick = function() {
        client.send(JSON.stringify(new Message("move", {from: move.from, to: move.to, promotion: 'q', playerType: playerType})));
        if (playerType === "White") {
            document.querySelector("#"+move.from).firstElementChild.src = 'images/chess/white_queen.png';
        }else {
            document.querySelector("#"+move.from).firstElementChild.src = "images/chess/black_queen.png";
        }
        panel.style.display = "none";
        board.style.pointerEvents = "all";
    }
    document.querySelector("#promoteRook").onclick = function() {
        client.send(JSON.stringify(new Message("move", {from: move.from, to: move.to, promotion: 'r', playerType: playerType})));
        if (playerType === "White") {
            document.querySelector("#"+move.from).firstElementChild.src ='images/chess/white_rook.png';
        }else {
            document.querySelector("#"+move.from).firstElementChild.src ="images/chess/black_rook.png";
        }
        panel.style.display = "none";
        board.style.pointerEvents = "all";
    }
    document.querySelector("#promoteBishop").onclick = function() {
        client.send(JSON.stringify(new Message("move", {from: move.from, to: move.to, promotion: 'b', playerType: playerType})));
        if (playerType === "White") {
            document.querySelector("#"+move.from).firstElementChild.src = 'images/chess/white_bishop.png';
        }else {
            document.querySelector("#"+move.from).firstElementChild.src = "images/chess/black_bishop.png";
        }
        panel.style.display = "none";
        board.style.pointerEvents = "all";
    }
    document.querySelector("#promoteKnight").onclick = function() {
        client.send(JSON.stringify(new Message("move", {from: move.from, to: move.to, promotion: 'n', playerType: playerType})));
        if (playerType === "White") {
            document.querySelector("#"+move.from).firstElementChild.src = 'images/chess/white_knight.png';
        }else {
            document.querySelector("#"+move.from).firstElementChild.src = "images/chess/black_knight.png";
        }
        panel.style.display = "none";
        board.style.pointerEvents = "all";
    }
}