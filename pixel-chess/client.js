const ws = require("ws");
const readline = require('readline');
const prompt = require('prompt-sync')({sigint: true});

const client = new ws("ws://localhost:8080");

client.on('open', () => {
    // while(true) {
    //     let answer = prompt("Next move pls:")
    //     client.send(answer);
    //  }
    setTimeout(function() {client.send("e2");},2000);
    setTimeout(function() {client.send("a7;a5");},5000);
    setTimeout(function() {client.close();},7000);
})

