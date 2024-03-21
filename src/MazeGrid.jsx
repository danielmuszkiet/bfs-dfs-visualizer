import "./MazeGrid.css";
import { useEffect, useState } from "react";

function MazeGrid({ mazeWidth = 35, mazeHeight = 35 }) {
  const [maze, setMaze] = useState([]);
  const [timeoutIds, setTimeOutIds] = useState([]);

  useEffect(() => {
    generateMaze(mazeHeight, mazeWidth);
  }, []);

  function bfs(startNode) {
    timeoutIds.forEach(clearTimeout);
    setMaze((maze) =>
      maze.map((row) =>
        row.map((cell) => {
          return cell === "visited" ? "path" : cell;
        })
      )
    );

    let queue = [startNode];
    let visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    function visitCell([x, y]) {
      setMaze((maze) =>
        maze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          })
        )
      );

      if (maze[y][x] === "end") {
        return true;
      }
      return false;
    }

    function step() {
      if (queue.length === 0) {
        return;
      }

      const [x, y] = queue.shift(); //FIFO!
      // x,y
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];

      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        const inBounds =
          (nx >= 0) & (nx < maze[0].length) && ny >= 0 && ny < maze.length;

        if (inBounds && !visited.has(`${nx}, ${ny}`)) {
          visited.add(`${nx}, ${ny}`);

          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            queue.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 50);
      setTimeOutIds((lastids) => [...lastids, timeoutId]);
    }

    step();
    return false;
  }

  function dfs(startNode) {
    timeoutIds.forEach(clearTimeout);
    setMaze((maze) =>
      maze.map((row) =>
        row.map((cell) => {
          return cell === "visited" ? "path" : cell;
        })
      )
    );

    let stack = [startNode];
    let visited = new Set(`${startNode[0]}, ${startNode[1]}`);

    function visitCell([x, y]) {
      setMaze((maze) =>
        maze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
              return cell === "end" ? "end" : "visited";
            }
            return cell;
          })
        )
      );

      if (maze[y][x] === "end") {
        return true;
      }
      return false;
    }

    function step() {
      if (stack.length === 0) {
        return;
      }

      const [x, y] = stack.pop(); //LIFO!
      // x,y
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ];
      const shuffledDirs = dirs.sort(() => 0.5 - Math.random());
      for (const [dx, dy] of shuffledDirs) {
        const nx = x + dx;
        const ny = y + dy;

        const inBounds =
          (nx >= 0) & (nx < maze[0].length) && ny >= 0 && ny < maze.length;

        if (inBounds && !visited.has(`${nx}, ${ny}`)) {
          visited.add(`${nx}, ${ny}`);

          if (maze[ny][nx] === "path" || maze[ny][nx] === "end") {
            if (visitCell([nx, ny])) {
              return true;
            }
            stack.push([nx, ny]);
          }
        }
      }
      const timeoutId = setTimeout(step, 50);
      setTimeOutIds((lastids) => [...lastids, timeoutId]);
    }

    step();
    return false;
  }

  function generateMaze(height, witdh) {
    let matrix = [];
    for (let i = 0; i < height; i++) {
      let row = [];
      for (let j = 0; j < witdh; j++) {
        row.push("wall");
      }
      matrix.push(row);
    }
    // [x,y] Direction
    const dirs = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ];

    function isCellValid(x, y) {
      const inBound = x < witdh && x >= 0 && y < height && y >= 0;
      return inBound && matrix[y][x] === "wall";
    }

    function carvePath(x, y) {
      matrix[y][x] = "path";
      // Shuffle dirs array to random order
      const directions = dirs.sort(() => Math.random() - 0.5);

      for (let [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
        if (isCellValid(nx, ny)) {
          matrix[y + dy][x + dx] = "path";
          carvePath(nx, ny);
        }
      }
    }

    carvePath(1, 1);
    matrix[1][0] = "start";
    matrix[matrix.length - 2][matrix[0].length - 1] = "end";
    setMaze(matrix);
  }

  function refreshMaze() {
    timeoutIds.forEach(clearTimeout);
    setTimeOutIds([]);
    generateMaze(mazeHeight, mazeWidth);
  }

  return (
    <div className="maze-grid">
      <div className="controls">
        <button className="maze-btn" onClick={() => refreshMaze()}>
          Refresh Maze
        </button>
        <button className="maze-btn" onClick={() => bfs([1, 0])}>
          Start BFS
        </button>
        <button className="maze-btn" onClick={() => dfs([1, 0])}>
          Start DFS
        </button>
      </div>
      <div className="maze">
        {maze.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((cell, cellIndex) => {
              return <div className={`cell ${cell}`} key={cellIndex}></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MazeGrid;
