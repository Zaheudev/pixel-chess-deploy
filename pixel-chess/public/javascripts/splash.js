const completedGames = document.querySelector("#gamesCompleted");
const abortedGames = document.querySelector("#gamesAborted");
const startedGames = document.querySelector("#gamesStarted");

function fetchData() {
  fetch('http://localhost:3000/data')
  .then((response) => {
    return response.json();
  })
  .then((json) => {
    // console.log(json);
    completedGames.innerHTML = json[0].value;
    abortedGames.innerHTML = json[1].value;
    startedGames.innerHTML = json[2].value;
  });
}

fetchData();

window.addEventListener('load', function () {
  var fetchInterval = 5000;

  setInterval(fetchData, fetchInterval);
});
  // setTimeout(()=>{
  //   console.log(json);
  //   completedGames.innerHTML = json[0].value;
  //   abortedGames.innerHTML = json[1].value;
  //   startedGames.innerHTML = json[2].value;
  // }, 5000);