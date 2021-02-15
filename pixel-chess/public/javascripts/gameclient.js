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
                    if (playerType === "Black") {
                        imgPlace.style.transform = "rotateX(180deg) rotateY(180deg)"
                    }
                    imgPlace.append(pieceCaptured);
                }
            }
            to.innerHTML = from.innerHTML;
            from.innerHTML = '';
            historyDiv.parentElement.firstElementChild.innerHTML = "MOVES!";
            const elem = document.createElement('p');
            elem.appendChild(document.createTextNode(`${from.id};${to.id}`));
            historyDiv.insertBefore(elem, historyDiv.firstElementChild);
            elem.style.color = historyDiv.parentElement.firstElementChild.style.color;
            turnText.firstElementChild.innerHTML = "OPPONENT'S TURN";
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
                // pieceCaptured.style.transform = "rotateX(180deg) rotateY(180deg)";
                let imgPlace = document.querySelector("#l"+piecesLostCounter);
                if (playerType === "Black") {
                        imgPlace.style.transform = "rotateX(180deg) rotateY(180deg)"
                    }
                imgPlace.append(pieceCaptured);
            }
        }
        to.innerHTML = from.innerHTML;
        from.innerHTML = '';
        historyDiv.parentElement.firstElementChild.innerHTML = "MOVES!";
        const elem = document.createElement('p');
        elem.appendChild(document.createTextNode(`${from.id};${to.id}`));
        historyDiv.insertBefore(elem, historyDiv.firstElementChild);
        elem.style.color = historyDiv.parentElement.firstElementChild.style.color;
        turnText.firstElementChild.innerHTML = "IT'S YOUR TURN";
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
        let minutesLabel = document.getElementById("minutes");
        let secondsLabel = document.getElementById("seconds");
        let totalSeconds = 0;
        setInterval(setTime, 1000);

        function setTime()
        {
            totalSeconds++;
            secondsLabel.innerHTML = pad(totalSeconds%60);
            minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
        }

        function pad(val)
        {
            var valString = val + "";
            if(valString.length < 2)
            {
                return "0" + valString;
            }
            else
            {
                return valString;
            }
        }
        setTimeout(()=>{
            state.innerHTML = "";
        }, 5000)
        break;
    case "playerType":
        console.log(msg.data);
        if(msg.data === "Black") {
            playerType = "Black";
            turnText.firstElementChild.innerHTML = "OPPONENT'S TURN"
            //swapRow("row8", "row1");
            flipBoard();
        }
        else if(msg.data === "White") {
            playerType = "White";
            turnText.firstElementChild.innerHTML = "IT'S YOUR TURN"
        }
        //TODO, flip board depending on color
        break;
    case "opponentLeft":
        let panel1 = document.querySelector("#opponentLeftPanel");
        panel1.style.display = "block";
        console.log("opponentLeft");
        break;
    case "You Win":
        console.log("You WON!");
        let panel2 = document.querySelector("#youWonPanel");
        panel2.style.display = "block";
        break;
    case "You Lost":
        console.log("You LOSE!");
        let panel3 = document.querySelector("#youLostPanel");
        panel3.style.display = "block";
        break;
    case "draw":
        let panel4 = document.querySelector("#drawPanel");
        panel4.style.display = "block";
        console.log("DRAW!")
    }
}

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