const ws = require("ws");

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    client.send("e2;e4");
    setTimeout(function() {client.send("a7;a5");},5000);
})
