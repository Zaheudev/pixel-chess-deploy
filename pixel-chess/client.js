const ws = require("ws");

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    client.send("e2;e4");
    client.send("d7;d5");
    client.send("e4;d5");
})