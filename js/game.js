const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let maze, player, npc, exit, gameActive = false;

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (maze[x][y] === 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }
}

function drawEntity(entity, color) {
  ctx.fillStyle = color;
  ctx.fillRect(entity.x * cellSize, entity.y * cellSize, cellSize, cellSize);
}

function moveNPC() {
  if (!gameActive) return;
  let dx = player.x - npc.x;
  let dy = player.y - npc.y;
  let newX = npc.x, newY = npc.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    newX += dx > 0 ? 1 : -1;
  } else {
    newY += dy > 0 ? 1 : -1;
  }
  if (newX >= 0 && newX < size && newY >= 0 && newY < size && maze[newX][newY] === 0) {
    npc.x = newX;
    npc.y = newY;
  }
  if (npc.x === player.x && npc.y === player.y) {
    endGame(false);
  }
  redraw();
}

function redraw() {
  drawMaze();
  drawEntity(player, "green");
  drawEntity(npc, "red");
  drawEntity(exit, "blue");
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  maze = generateMaze();
  player = { x: 0, y: 0 };
  npc = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
  exit = { x: size - 1, y: size - 1 };
  gameActive = true;
  redraw();
  startTimer();
  setInterval(moveNPC, 500);
}

function endGame(won) {
  gameActive = false;
  stopTimer();
  document.getElementById("restartBtn").style.display = "block";
  if (won) {
    addToLeaderboard(getTime());
    alert("You Win!");
  } else {
    alert("Game Over!");
  }
}

document.addEventListener("keydown", (e) => {
  if (!gameActive) return;
  let newX = player.x, newY = player.y;
  if (e.key === "ArrowUp") newY--;
  if (e.key === "ArrowDown") newY++;
  if (e.key === "ArrowLeft") newX--;
  if (e.key === "ArrowRight") newX++;
  if (newX >= 0 && newX < size && newY >= 0 && newY < size && maze[newX][newY] === 0) {
    player.x = newX;
    player.y = newY;
    redraw();
    if (player.x === exit.x && player.y === exit.y) {
      endGame(true);
    }
  }
});