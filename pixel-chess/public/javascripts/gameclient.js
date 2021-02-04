const client = new WebSocket("ws://localhost:8080");
client.binaryType = "arraybuffer";

const board = document.querySelector(".chess-board");
const state = document.querySelector("#state h3");


//TODO parse JSON messages, depending on message.type, resolve message
client.onmessage = function (event) {
    console.log(event.data);
    let msg = JSON.parse(event.data);
    resolveMsg(msg);
    /*
    if(event.data === "Started"){
        console.log(state);
        state.innerHTML = "Starting..."
    }
    */

}

function resolveMsg(msg) {
    switch(msg.type) {
    case "possibleMoves":
        console.log(msg.data);
        for (let move of msg.data) {
            let e = document.getElementById(move.to);
            if (move.flag === 'c' || move.flag === 'e') {
                e.style.backgroundColor = 'red';
            }
            e.style.backgroundColor = "green";
        }
        break;
    case "validity":
        console.log(msg.data);
        break;
    case "turn":
        console.log("Your turn");
        break;
    case "check":
        console.log("You're in check!");
        break;
    case "gameStart":
        console.log("Game has started");
        break;
    case "playerType":
        console.log(msg.data);
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

//TODO reset all possibleMoves if another piece is selected!
//TODO send move to server if possibleMove cell is selected after click on a piece
var pieceSelected = false;
board.addEventListener('click', (e)=>{
    let imgCell = document.getElementById(e.target.id); 
    if (e.target.nodeName === 'TD') {
        if(imgCell.hasChildNodes()){
            console.log(imgCell.firstElementChild);
            //imgCell.style.borderColor = "red";
            pieceSelected = true;
        }
        if(pieceSelected){
            console.log(e.target.id);
            client.send(e.target.id);
        }
    }else if(e.target.nodeName === 'IMG'){
        console.log(imgCell.parentElement.id);
        //imgCell.parentElement.style.borderColor = "red";
        pieceSelected = true;
        console.log(e.target);
        client.send(imgCell.parentElement.id);
    }

// });

// board.addEventListener('mouseover', (e)=>{
//     // if(e.target.nodeName.toUpperCase() === 'TD'){
//     //     let cell = document.getElementById(e.target.id);
//     //     cell.firstChild.style.position = "absolute";

//     //     cell.addEventListener('mouseout', (e)=>{
//     //         cell.firstChild.style.position = null;
//     //     });
//     // }

//     if(e.target.nodeName.toUpperCase() === 'IMG'){
//         let img = document.getElementById(e.target.id);
//     }
});