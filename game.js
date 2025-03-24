const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const size = 20; // 20x20迷宫，更复杂
const cellSize = 20; // 缩小格子适应屏幕
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let maze = Array(size).fill().map(() => Array(size).fill(1)); // 1=墙
let player = { x: 0, y: 0 }; // 玩家初始位置
let npc = { x: Math.floor(size / 2), y: Math.floor(size / 2) }; // NPC初始在中间
let exit = { x: size - 1, y: size - 1 }; // 出口在右下角
let gameActive = false;

function generateMaze(x, y) {
  maze[x][y] = 0; // 0=路
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  directions.sort(() => Math.random() - 0.5); // 随机打乱方向
  for (let [dx, dy] of directions) {
    let nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[nx][ny] === 1) {
      maze[x + dx / 2][y + dy / 2] = 0; // 打通中间墙
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
  // 简单AI：优先沿较大偏差方向移动
  let dx = player.x - npc.x;
  let dy = player.y - npc.y;
  if (Math.abs(dx) > Math.abs(dy)) {
    npc.x += dx > 0 ? 1 : -1;
  } else {
    npc.y += dy > 0 ? 1 : -1;
  }
  // 撞墙则随机重置到可通行位置
  if (maze[npc.x][npc.y] === 1) {
    do {
      npc.x = Math.floor(Math.random() * size);
      npc.y = Math.floor(Math.random() * size);
    } while (maze[npc.x][npc.y] === 1);
  }
  // 检查是否抓住玩家
  if (npc.x === player.x && npc.y === player.y) {
    gameActive = false;
    alert("Game Over! You were caught by the NPC!");
  }
  redraw();
}

function redraw() {
  drawMaze();
  drawPlayer();
  drawNPC();
  drawExit();
}

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  canvas.style.display = "block";
  // 初始化迷宫
  maze = Array(size).fill().map(() => Array(size).fill(1));
  generateMaze(0, 0);
  maze[exit.x][exit.y] = 0; // 确保出口可达
  player = { x: 0, y: 0 };
  npc = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
  gameActive = true;
  redraw();
  setInterval(moveNPC, 500); // NPC每0.5秒移动一次
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
      gameActive = false;
      alert("You Win! You reached the exit!");
    }
  }
});