const ws = require("ws");
const prompt = require('prompt-sync')({sigint: true});

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    setTimeout(function() {client.send("f2;f3");},3000);
    //client.close();
    //  setTimeout(function() {client.close();},7000);
    // while(true) {
    //     let answer = prompt("Next move pls:")
    //     client.send(answer);
    //  }

})
client.on('message', function(message) {
    console.log(message);
})
