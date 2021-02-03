const client = new WebSocket("ws://localhost:8080");

var board = document.querySelector(".chess-board");
var state = document.querySelector("#state");

client.onmessage = function (event) {
    console.log(event.data);
    if(event.data === "Started"){
        state.innerHTML = "Starting...";
    }
}

board.addEventListener('click', (e)=>{
    if (e.target.nodeName.toUpperCase() === 'TD') {
        if(document.querySelector("#"+e.target.id).hasChildNodes()){
            let imgCell = document.querySelector("#"+e.target.id);
            console.log(imgCell.firstElementChild);
        }
       console.log(e.target.id);
    }else if(e.target.nodeName.toUpperCase() === 'IMG'){
        let cellImg = document.querySelector("#"+e.target.id);
        console.log(cellImg.parentElement.id);
        console.log(e.target);
    }
});