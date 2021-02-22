//parse JSON messages, depending on message.type, resolve message

client.onmessage = function (event) {
    console.log(event.data);
    let msg = JSON.parse(event.data);
    resolveMsg(msg);
}

var possible = [];
var img = null;
var currentPiece = null;

function resolveMsg(msg) {
    switch(msg.type) {
    case "possibleMoves":
        console.log("Possible moves:\n");
        console.log(msg.data);
        possibleMoves = msg.data;
        for (let move of msg.data) {
            let e = document.getElementById(move.to);
            if (move.flags.includes('c') || move.flags.includes('e')) {
                e.style.backgroundColor = "red";
                possible.push(e.id);
            }
            else {
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
            king = document.getElementById("white_king");
        }
        else if (playerType === "Black") {
            king = document.getElementById("black_king");
        }
        king.style.backgroundColor = "red";
        break;
    //TODO fix positioning of game started message to not move everything around it
    case "gameStart":
        console.log("Game has started");
        state.innerHTML = "Player joined. Game Started";
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
            flipBoard();
        }
        else if(msg.data === "White") {
            playerType = "White";
            turnText.firstElementChild.innerHTML = "IT'S YOUR TURN"
        }
        break;
    case "Castling":
        let rookImg;
        let targetCell;
        let oldRookCell;
        
        if(msg.data.side === 'k'){
            if(playerType === "White"){
                rookImg = document.querySelector("#black_rook2");
                targetCell = document.querySelector("#"+msg.data.rookpos);
                oldRookCell = rookImg.parentElement;
                oldRookCell.removeChild(oldRookCell.firstElementChild);
                targetCell.appendChild(rookImg);
            }else{
                rookImg = document.querySelector("#white_rook2");
                targetCell = document.querySelector("#"+msg.data.rookpos);
                oldRookCell = rookImg.parentElement;
                oldRookCell.removeChild(oldRookCell.firstElementChild);
                targetCell.appendChild(rookImg);
            }
        }else if(msg.data.side === 'q'){
            if(playerType === "White"){
                rookImg = document.querySelector("#black_rook1");
                targetCell = document.querySelector("#"+msg.data.rookpos);
                oldRookCell = rookImg.parentElement;
                oldRookCell.removeChild(oldRookCell.firstElementChild);
                targetCell.appendChild(rookImg);
            }else{
                rookImg = document.querySelector("#white_rook1");
                targetCell = document.querySelector("#"+msg.data.rookpos);
                oldRookCell = rookImg.parentElement;
                oldRookCell.removeChild(oldRookCell.firstElementChild);
                targetCell.appendChild(rookImg);
            }
        }
        break;
    case "QUEEN":
        currentPiece = document.querySelector("#"+msg.data).firstElementChild;
        if(playerType === "Black"){
            currentPiece.src = 'images/chess/white_queen.png';
            currentPieceCell = null;
        }else{
            currentPiece.src = "images/chess/black_queen.png";
            currentPieceCell = null;
        }
        break;
    case "ROOK":
        currentPiece = document.querySelector("#"+msg.data).firstElementChild;
        if(playerType === "Black"){
            currentPiece.src = 'images/chess/white_rook.png';
            currentPiece = null;
        }else{
            currentPiece.src = "images/chess/black_rook.png";
            currentPiece = null;
        }
        break;
    case "BISHOP":
        currentPiece = document.querySelector("#"+msg.data).firstElementChild;
        if(playerType === "Black"){
            currentPiece.src = 'images/chess/white_bishop.png';
            currentPiece = null;
        }else{
            currentPiece.src = "images/chess/black_bishop.png";
            currentPiece = null;
        }
        break;
    case "KNIGHT":
        currentPiece = document.querySelector("#"+msg.data).firstElementChild;
        if(playerType === "Black"){
            currentPiece.src = 'images/chess/white_knight.png';
            currentPiece = null;
        }else{
            currentPiece.src = "images/chess/black_knight.png"
            currentPiece = null;
        }
        break;
    case "opponentLeft":
        let panel1 = document.querySelector("#opponentLeftPanel");
        panel1.style.display = "block";
        console.log("opponentLeft");
        break;
    case "You Won":
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