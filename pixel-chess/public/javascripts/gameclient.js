const client = new WebSocket("ws://localhost:8080");
client.binaryType = "arraybuffer";

const board = document.querySelector(".chess-board");
const state = document.querySelector("#state h3");



client.onmessage = function (event) {
    console.log(event.data);
    if(event.data === "Started"){
        console.log(state);
        state.innerHTML = "Starting..."
    }
    if(event.data instanceof ArrayBuffer) {
        const typedArray = new Uint16Array(event.data);
        const availMoves = Array.from(typedArray);
        for (let move of availMoves){
            console.log(move);
        }
    }
}

var pieceSelected = false;
board.addEventListener('click', (e)=>{
    let imgCell = document.getElementById(e.target.id); 
    if (e.target.nodeName === 'TD') {
        if(imgCell.hasChildNodes()){
            console.log(imgCell.firstElementChild);
            imgCell.style.borderColor = "red";
            pieceSelected = true;
        }
        if(pieceSelected){
            console.log(e.target.id);
            client.send(e.target.id);
        }
    }else if(e.target.nodeName === 'IMG'){
        console.log(imgCell.parentElement.id);
        imgCell.parentElement.style.borderColor = "red";
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