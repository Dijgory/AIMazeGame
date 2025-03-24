let startTime, timerInterval;
const timerDisplay = document.getElementById("timer");
const leaderboardList = document.getElementById("leaderboardList");

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    let time = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `Time: ${time}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function getTime() {
  return Math.floor((Date.now() - startTime) / 1000);
}

function addToLeaderboard(time) {
  let scores = JSON.parse(localStorage.getItem("mazeScores") || "[]");
  scores.push(time);
  scores.sort((a, b) => a - b);
  scores = scores.slice(0, 5);
  localStorage.setItem("mazeScores", JSON.stringify(scores));
  updateLeaderboard(scores);
}

function updateLeaderboard(scores) {
  leaderboardList.innerHTML = "";
  scores.forEach((score, index) => {
    let li = document.createElement("li");
    li.textContent = `#${index + 1}: ${score}s`;
    leaderboardList.appendChild(li);
  });
}

document.getElementById("restartBtn").addEventListener("click", () => {
  document.getElementById("restartBtn").style.display = "none";
  startGame();
});

updateLeaderboard(JSON.parse(localStorage.getItem("mazeScores") || "[]"));