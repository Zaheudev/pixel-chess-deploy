//TODO use cookies to remember dark mode state across all pages
//TODO fix splash image darkmode
//TODO Disable dark mode button until fade is complete (or for a few seconds)

const darkbutton = document.querySelector("#darkmode");
const quit = document.querySelector("#quitBtn");
const tableCell = document.querySelectorAll(".chess-board td");

var page = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

//false = light mode, true = darkmode
let toggle = false;

darkbutton.addEventListener("click", function() {
    let h1 = document.querySelectorAll("h1");
    let h2 = document.querySelectorAll("h2");
    let h3 = document.querySelectorAll("h3");
    let p = document.querySelectorAll("p");
    let th = document.querySelectorAll(".chess-board th");
    let buttons = document.querySelectorAll("button");
    let panels = document.querySelectorAll("#center div");

    if (toggle === false) {
        toggle = true;
        //document.body.style.backgroundColor = "Black";
        fadeBackground(document.body, [255,255,255], [0,0,0], 250);
        // timer.style.color = "White";
        h1.forEach(function(e) {
            //e.style.color = "White";
            if(e.id != "private"){
                fadeFontColor(e, [0,0,0], [255,255,255], 250);                
            }
        })
        h2.forEach(function(e) {
            //e.style.color = "White";
            fadeFontColor(e, [0,0,0], [255,255,255], 250);
        })
        h3.forEach(function(e) {
            //e.style.color = "White";
            fadeFontColor(e, [0,0,0], [255,255,255], 250);
        })
        p.forEach(function(e) {
            //e.style.color = "White";
            if(e.id != "private"){
                fadeFontColor(e, [0,0,0], [255,255,255], 250);
            }
        })
        th.forEach(function(e) {
            //e.style.color = "White";
            fadeFontColor(e, [0,0,0], [255,255,255], 250);
        })
        buttons.forEach(function(e) {
            //e.style.color = "White";
            fadeFontColor(e, [255,255,255], [0,0,0], 250);
            fadeBackground(e, [0,0,0], [255,255,255], 250);
            if(page != "play"){
                let form =  document.querySelector("input");
                fadeBackground(form, [0,0,0], [255,255,255], 250);
                fadeFontColor(form, [255,255,255], [0,0,0], 250);
            }
        })
        panels.forEach(function(e) {
            if(page === "play"){
                fadeFontColor(e, [255,255,255], [0,0,0], 250);
                fadeBackground(e, [0,0,0], [255,255,255], 250);
                fadeBorderColor(e, [255,255,255], [0,0,0], 250);
            }
        })
    }
    else {
        toggle = false;
        fadeBackground(document.body, [0,0,0], [255,255,255], 250);
        // timer.style.color = "";
        h1.forEach(function(e) {
            //e.style.color = "";
            if(e.id != "private"){
                fadeFontColor(e, [255,255,255], [0,0,0], 250);
            }
        })
        h2.forEach(function(e) {
            //e.style.color = "";
            fadeFontColor(e, [255,255,255], [0,0,0], 250);
        })
        h3.forEach(function(e) {
            //e.style.color = "";
            fadeFontColor(e, [255,255,255], [0,0,0], 250);
        })
        p.forEach(function(e) {
            //e.style.color = "";
            if(e.id != "private"){
                fadeFontColor(e, [255,255,255], [0,0,0], 250);
            }
        })
        th.forEach(function(e) {
            //e.style.color = "";
            fadeFontColor(e, [255,255,255], [0,0,0], 250);
        })
        buttons.forEach(function(e) {
            //e.style.color = "";
            fadeFontColor(e, [0,0,0], [255,255,255], 250);
            fadeBackground(e, [255,255,255], [0,0,0], 250);
            if(page != "play"){
                let form =  document.querySelector("input");
                fadeBackground(form, [255,255,255], [0,0,0], 250);
                fadeFontColor(form, [0,0,0], [255,255,255], 250);
            }
        })
        panels.forEach(function(e) {
            if(page === "play"){
                fadeFontColor(e, [0,0,0], [255,255,255], 250);
                fadeBackground(e, [255,255,255], [0,0,0], 250);
                fadeBorderColor(e, [0,0,0], [255,255,255], 250);
            }
        })
    }
})

function fadeBackground(element, startColor, endColor, steps) {
    let stepCount = 0;
    let currentColor = startColor;
    let redChange = (startColor[0] - endColor[0]) / steps;
    let greenChange = (startColor[1] - endColor[1]) / steps;
    let blueChange = (startColor[2] - endColor[2]) / steps;

    let fadeTimer = setInterval(function() {
        currentColor[0] = parseInt(currentColor[0] - redChange);
        currentColor[1] = parseInt(currentColor[1] - greenChange);
        currentColor[2] = parseInt(currentColor[2] - blueChange);
        element.style.backgroundColor = "rgb(" + currentColor.toString() + ")";
        stepCount++;
        if (stepCount >= steps) {
            element.style.backgroundColor = "rgb(" + endColor.toString() + ")";
            clearInterval(fadeTimer);
        }
    }, 5);
}

function fadeFontColor(element, startColor, endColor, steps) {
    let stepCount = 0;
    let currentColor = startColor;
    let redChange = (startColor[0] - endColor[0]) / steps;
    let greenChange = (startColor[1] - endColor[1]) / steps;
    let blueChange = (startColor[2] - endColor[2]) / steps;

    let fadeTimer = setInterval(function() {
        currentColor[0] = parseInt(currentColor[0] - redChange);
        currentColor[1] = parseInt(currentColor[1] - greenChange);
        currentColor[2] = parseInt(currentColor[2] - blueChange);
        element.style.color = "rgb(" + currentColor.toString() + ")";
        stepCount++;
        if (stepCount >= steps) {
            element.style.color = "rgb(" + endColor.toString() + ")";
            clearInterval(fadeTimer);
        }
    }, 5);
}

function fadeBorderColor(element, startColor, endColor, steps) {
    let stepCount = 0;
    let currentColor = startColor;
    let redChange = (startColor[0] - endColor[0]) / steps;
    let greenChange = (startColor[1] - endColor[1]) / steps;
    let blueChange = (startColor[2] - endColor[2]) / steps;

    let fadeTimer = setInterval(function() {
        currentColor[0] = parseInt(currentColor[0] - redChange);
        currentColor[1] = parseInt(currentColor[1] - greenChange);
        currentColor[2] = parseInt(currentColor[2] - blueChange);
        element.style.borderColor = "rgb(" + currentColor.toString() + ")";
        stepCount++;
        if (stepCount >= steps) {
            element.style.borderColor = "rgb(" + endColor.toString() + ")";
            clearInterval(fadeTimer);
        }
    }, 5);
}