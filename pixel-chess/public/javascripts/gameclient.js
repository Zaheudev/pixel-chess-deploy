const client = new WebSocket("ws://localhost:8080");

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
                    //client.send(cell1+";"+cell2);
                    client.send(JSON.stringify(new Message("move",cell1+";"+cell2)));
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
                    //client.send(cell1+";"+cell2);
                    client.send(JSON.stringify(new Message("move",cell1+";"+cell2)));
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