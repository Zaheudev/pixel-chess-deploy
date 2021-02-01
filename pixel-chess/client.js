const ws = require("ws");

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    setTimeout(function() {client.send("e2;e4");},2000);
    setTimeout(function() {client.send("a7;a5");},5000);
    setTimeout(function() {client.close();},7000);
})
