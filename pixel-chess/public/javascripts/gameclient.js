const client = new WebSocket("ws://localhost:8080");

client.onmessage = function (event) {
    console.log(event.data);
}