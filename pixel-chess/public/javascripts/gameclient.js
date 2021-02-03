const client = new WebSocket("ws://localhost:8080");

var board = document.querySelector(".chess-board");

client.onmessage = function (event) {
    console.log(event.data);
}

console.log(board);

board.addEventListener('click', (e)=>{
    if (e.target.nodeName.toUpperCase() === 'TD') {
       console.log(e.target.id);
    }else if(e.target.nodeName.toUpperCase() === 'IMG'){
        console.log(e.target);
    }
});