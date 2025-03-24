const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const size = 10; // 10x10迷宫
const cellSize = 40;
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let maze = Array(size).fill().map(() => Array(size).fill(1)); // 1=墙
let player = { x: 0, y: 0 }; // 玩家位置
let npc = { x: size - 1, y: size - 1 }; // NPC位置
let exit = { x: size - 1, y: size - 1 }; // 出口位置
let gameActive = false;

function generateMaze(x, y) {
  maze[x][y] = 0;
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  directions.sort(() => Math.random() - 0.5);
  for (let [dx, dy] of directions) {
    let nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[nx][ny] === 1) {
      maze[x + dx / 2][y + dy / 2] = 0;
      generateMaze(nx, ny);
    }
  }
}

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

function drawPlayer() {
  ctx.fillStyle = "green";
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

function drawNPC() {
  ctx.fillStyle = "red";
  ctx.fillRect(npc.x * cellSize, npc.y * cellSize, cellSize, cellSize);
}

function drawExit() {
  ctx.fillStyle = "blue";
  ctx.fillRect(exit.x * cellSize, exit.y * cellSize, cellSize, cellSize);
}

function moveNPC() {
  if (!gameActive) return;
  if (Math.abs(npc.x - player.x) > Math.abs(npc.y - player.y)) {
    npc.x += npc.x < player.x ? 1 : -1;
  } else {
    npc.y += npc.y < player.y ? 1 : -1;
  }
  if (maze[npc.x][npc.y] === 1) {
    npc = { x: size - 1, y: size - 1 }; // 撞墙重置
  }
  if (npc.x === player.x && npc.y === player.y) {
    gameActive = false;
    alert("Game Over! You were caught!");
  }
  drawMaze();
  drawPlayer();
  drawNPC();
  drawExit();
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  generateMaze(0, 0);
  exit = { x: size - 1, y: size - 1 }; // 出口在右下角
  maze[exit.x][exit.y] = 0; // 确保出口可达
  gameActive = true;
  drawMaze();
  drawPlayer();
  drawNPC();
  drawExit();
  setInterval(moveNPC, 1000); // NPC每秒移动
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
    drawMaze();
    drawPlayer();
    drawNPC();
    drawExit();
    if (player.x === exit.x && player.y === exit.y) {
      gameActive = false;
      alert("You Win! You reached the exit!");
    }
  }
});