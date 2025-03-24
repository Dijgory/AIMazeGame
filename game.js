const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const size = 10; // 10x10迷宫
const cellSize = 40;
canvas.width = size * cellSize;
canvas.height = size * cellSize;

let maze = Array(size).fill().map(() => Array(size).fill(1)); // 1=墙

function generateMaze(x, y) {
  maze[x][y] = 0; // 0=路
  const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
  directions.sort(() => Math.random() - 0.5); // 随机方向
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

generateMaze(0, 0); // 从(0,0)开始生成
drawMaze();