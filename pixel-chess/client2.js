const ws = require("ws");

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    setTimeout(function() {client.send("f2;f3");},3000);
    //client.close();

})
