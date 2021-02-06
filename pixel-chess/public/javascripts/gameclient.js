const client = new WebSocket("ws://localhost:8080");

const board = document.querySelector(".chess-board");
const state = document.querySelector("#state h1");
const historyDiv = document.querySelector("#historyElements");
const turnText = document.querySelector("#turn");
const piecesgained = document.querySelector("#pieces-gained"); 
const pieceslost = document.querySelector("#pieces-lost"); 

var possiblePieces = [];
var possibleMoves = [];
var playerType = "";
var pieceCaptured = null;
var piecesGainedCounter = -1;
var piecesLostCounter = -1;

//parse JSON messages, depending on message.type, resolve message
client.onmessage = function (event) {
    console.log(event.data);
    let msg = JSON.parse(event.data);
    resolveMsg(msg);
}

var possible = [];
var img = null;
function resolveMsg(msg) {
    switch(msg.type) {
    case "possibleMoves":
        console.log(msg.data);
        possibleMoves = msg.data;
        for (let move of msg.data) {
            let e = document.getElementById(move.to);
            if (move.flags === 'c' || move.flags === 'e') {
                e.style.backgroundColor = "red";
                possible.push(e.id);
            }else {
                e.style.backgroundColor = "green";
                possible.push(e.id);
            }
        }
        break;
    case "validity":
        console.log(msg.data);
        if(msg.data == "valid") {
            let from = document.getElementById(cell1);
            let to = document.getElementById(cell2);
            if(to.hasChildNodes()){
                piecesGainedCounter++;
                if(to.firstElementChild.nodeName === "IMG"){
                    pieceCaptured = to.firstElementChild;
                    let imgPlace = document.querySelector("#G"+piecesGainedCounter);
                    imgPlace.append(pieceCaptured);
                }
            }
            to.innerHTML = from.innerHTML;
            from.innerHTML = '';
            historyDiv.parentElement.firstElementChild.innerHTML = "MOVES!";
            const elem = document.createElement('p');
            elem.appendChild(document.createTextNode(`${from.id};${to.id}`));
            historyDiv.appendChild(elem);
            turnText.firstElementChild.innerHTML = "OPPONENT TURN";
        }
        break;
    case "turn":
        console.log("Your turn");
        possiblePieces = msg.data;
        console.log(possiblePieces);
        break;
    case "opponentMove":
        console.log("Opponent's move is: "+msg.data.from+";"+msg.data.to);
        let from = document.getElementById(msg.data.from);
        let to = document.getElementById(msg.data.to);
        if(to.hasChildNodes()){
            piecesLostCounter++;
            if(to.firstElementChild.nodeName === "IMG"){
                pieceCaptured = to.firstElementChild;
                let imgPlace = document.querySelector("#l"+piecesLostCounter);
                imgPlace.append(pieceCaptured);
            }
        }
        to.innerHTML = from.innerHTML;
        from.innerHTML = '';
        historyDiv.parentElement.firstElementChild.innerHTML = "MOVES!";
        const elem = document.createElement('p');
        elem.appendChild(document.createTextNode(`${from.id};${to.id}`));
        historyDiv.appendChild(elem);
        turnText.firstElementChild.innerHTML = "YOUR TURN";
        break;
    case "check":
        console.log("You're in check!");
        let king;
        if (playerType === "White") {
            king = document.getElementById("white_king")
        }
        else if (playerType === "Black") {
            king = document.getElementById("black_king")
        }
        king.style.backgroundColor = "red";
        break;
    case "gameStart":
        console.log("Game has started");
        state.innerHTML = "Player joined. Game Started"
        setTimeout(()=>{
            state.innerHTML = "";
        }, 5000)
        break;
    case "playerType":
        console.log(msg.data);
        if(msg.data === "Black") {
            playerType = "Black";
            turnText.firstElementChild.innerHTML = "OPPONENT TURN"
        }
        else if(msg.data === "White") {
            playerType = "White";
        }
        //TODO, flip board depending on color
        break;
    case "player-disconnect":
        console.log("Opponent disconnected");
        break;
    case "win":
        console.log("You WON!");
        break;
    case "lose":
        console.log("You LOSE!");
        break;
    case "draw":
        console.log("DRAW!")
    }
}

swapRow("row8", "row1");
function swapRow(target, replacer){
    //target is the element you want to swipe with 'replacer' element
    //target and replacer parameters are STRING IDS (e.g "row 2" and "row 4") "row 2" will take palce of row 4 and row 4 will take place of row 2 
    let targetVar = document.querySelector("#"+target);
    let replacerVar = document.querySelector("#"+replacer); 
    let temp = targetVar;
    let parent = document.querySelector("#rows");
    
    parent.replaceChild(replacerVar, targetVar);
}

//reset all possibleMoves if another cell is selected!
//send move to server if possibleMove cell is selected after click on a piece
var pieceSelected = false;
var cell1 = null;
var cell2 = null;

board.addEventListener('click', (e)=>{
    let imgCell = document.getElementById(e.target.id);
    
    if (e.target.nodeName === 'TD') {
        if (!pieceSelected) {
            if (possiblePieces.includes(e.target.id)){
                cell1 = e.target.id;
                console.log("Cell1 = "+cell1);
                client.send(cell1);
                pieceSelected = true;
                console.log(possible);
            }
        }else {
            if (possible.includes(e.target.id)) {
                cell2 = e.target.id;
                console.log("Cell2 = "+ cell2);
                if (cell1 != null && cell2 != null) {
                    console.log(cell1+";"+cell2);
                    client.send(cell1+";"+cell2);
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
    //TODO make it work when pressing on image as well!!!
    }else if(e.target.nodeName === 'IMG'){
        console.log(imgCell.parentElement.id);
        if (!pieceSelected) {
            if (possiblePieces.includes(imgCell.parentElement.id)) {
                cell1 = e.target.parentElement.id;
                console.log("Cell1 = "+cell1);
                client.send(cell1);
                pieceSelected = true;
            }
        }else {
            if (possible.includes(imgCell.parentElement.id)) {
                cell2 = e.target.parentElement.id;
                console.log("Cell2 = "+ cell2);
                if (cell1 != null && cell2 != null) {
                    console.log(cell1+";"+cell2);
                    client.send(cell1+";"+cell2);
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