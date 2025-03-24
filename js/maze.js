const size = 20;
const cellSize = 20;

function generateMaze() {
  let maze = Array(size).fill().map(() => Array(size).fill(1));
  function carve(x, y) {
    maze[x][y] = 0;
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0]];
    directions.sort(() => Math.random() - 0.5);
    for (let [dx, dy] of directions) {
      let nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size && maze[nx][ny] === 1) {
        maze[x + dx / 2][y + dy / 2] = 0;
        carve(nx, ny);
      }
    }
  }
  carve(0, 0);
  // 确保出口可达并有缺口
  maze[size - 1][size - 1] = 0;
  if (maze[size - 2][size - 1] === 1 && maze[size - 1][size - 2] === 1) {
    maze[size - 2][size - 1] = 0; // 强制缺口
  }
  return maze;
}