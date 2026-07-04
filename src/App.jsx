import { useState } from 'react'
import { dijkstra } from './algorithms/dijkstra';
import { astar } from "./algorithms/astar";
import './App.css'

function App() {

  const rows = 20;
  const cols = 50;
  const [startPos, setStartPos] = useState({ row: 5, col: 10 });
  const [endPos, setEndPos] = useState({ row: 10, col: 35 });
  function createGrid() {
    let grid = [];

    for (let i = 0; i < rows; i++) {

      let currentRow = [];


      for (let j = 0; j < cols; j++) {

        currentRow.push({
          row: i,
          col: j,

          isStart: i === 5 && j === 10,
          isEnd: i === 10 && j === 35,
          isWall: false,
          heuristic: 0,
          distance: Infinity,

          visited: false,

          previous: null,
          isPath: false,
        })

      }
      grid.push(currentRow)

    }
    return grid

  }
  const [grid, setGrid] = useState(() => createGrid());
  const [mousePressed, setMousePressed] = useState(false);

  const [draggingStart, setDraggingStart] = useState(false);
  const [draggingEnd, setDraggingEnd] = useState(false);
  const [algorithm, setAlgorithm] = useState("dijkstra");
  const [speed, setSpeed] = useState(10);
  const [stats, setStats] = useState({
    algorithm: "Dijkstra",
    visited: 0,
    path: 0,
    time: 0
  });
  function handleClick(row, col) {

    const newGrid = grid.map(r => [...r])

    const node = newGrid[row][col];
    if (node.isStart || node.isEnd) return;
    node.isWall = !node.isWall;

    setGrid(newGrid);

  }
  function moveStart(newRow, newCol) {

    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    if (newGrid[newRow][newCol].isEnd) return;
    if (newGrid[newRow][newCol].isWall) return;
    // Remove old start
    newGrid[startPos.row][startPos.col].isStart = false;

    // Make new start
    newGrid[newRow][newCol].isStart = true;

    setStartPos({
      row: newRow,
      col: newCol
    });

    setGrid(newGrid);
  }
  function moveEnd(newRow, newCol) {

    const newGrid = grid.map(row => row.map(node => ({ ...node })));
    if (newGrid[newRow][newCol].isStart) return;
    if (newGrid[newRow][newCol].isWall) return;

    newGrid[endPos.row][endPos.col].isEnd = false;

    newGrid[newRow][newCol].isEnd = true;

    setEndPos({
      row: newRow,
      col: newCol
    });

    setGrid(newGrid);
  }
  function resetGrid() {

    setStartPos({
      row: 5,
      col: 10
    });

    setEndPos({
      row: 10,
      col: 35
    });

    setGrid(createGrid());
    setStats({
      algorithm: "Dijkstra",
      visited: 0,
      path: 0,
      time: 0
    });

  }
  function visualize() {

    for (let row of grid) {
      for (let node of row) {

        node.visited = false;
        node.isPath = false;
        node.distance = Infinity;
        node.previous = null;

      }
    }

    const start = grid[startPos.row][startPos.col];
    const end = grid[endPos.row][endPos.col];
    const startTime = performance.now();

    let visited = [];

    if (algorithm === "dijkstra") {
      visited = dijkstra(grid, start, end);
    }
    else {
      visited = astar(grid, start, end);
    }

    const endTime = performance.now();

    if (algorithm === "dijkstra") {
      visited = dijkstra(grid, start, end);
    }
    else {
      visited = astar(grid, start, end);
    }

    const path = getShortestPath(end);
    setStats({
      algorithm: algorithm === "dijkstra" ? "Dijkstra" : "A*",
      visited: visited.length,
      path: path.length,
      time: (endTime - startTime).toFixed(2)
    });
    animateVisited(visited);
    setTimeout(() => {
      animatePath(path);
    }, visited.length * speed);
    console.log(path);
  }
  function getShortestPath(endNode) {

    const path = [];

    let current = endNode;

    while (current !== null) {

      path.unshift(current);

      current = current.previous;
    }

    return path;
  }
  function animateVisited(visited) {

    for (let i = 0; i < visited.length; i++) {

      setTimeout(() => {

        visited[i].visited = true;

        setGrid(g => [...g]);

      }, speed * i);

    }

  }
  function animatePath(path) {

    for (let i = 0; i < path.length; i++) {

      setTimeout(() => {

        path[i].isPath = true;

        setGrid(g => [...g]);

      }, (speed + 20) * i);

    }

  }
  function clearPath() {

    const newGrid = [...grid];

    for (let row of newGrid) {

      for (let node of row) {

        node.visited = false;
        node.isPath = false;
        node.distance = Infinity;
        node.previous = null;

      }

    }

    setGrid(newGrid);
    setStats({
      algorithm: algorithm === "dijkstra" ? "Dijkstra" : "A*",
      visited: 0,
      path: 0,
      time: 0
    });
  }
  function clearWalls() {

    const newGrid = [...grid];

    for (let row of newGrid) {

      for (let node of row) {

        node.isWall = false;

      }

    }

    setGrid(newGrid);

  }
  function generateMaze() {
    const newGrid = grid.map(row => [...row]);
    for (let row of newGrid) {
      for (let node of row) {
        if (node.isStart || node.isEnd) continue;
        node.isWall = Math.random() < 0.25;
      }
    }
    setGrid(newGrid);
  }


  return (

    <div className='app'>

      <div className='header'>
        <h1>Shortest Path Visualizer</h1>
        <div className='controls'>
          <button onClick={visualize}>Visualize</button>
          <select value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A*</option>
          </select>
          <div className="speed-control">
            <label>Speed</label>
            <input
              type="range"
              min="1"
              max="20"
              value={21 - speed} onChange={(e) => setSpeed(21 - Number(e.target.value))}
            />
            <span>{speed} ms</span>
          </div>
          <button onClick={generateMaze}>Generate Maze</button>
          <button onClick={clearPath}>Clear Path</button>
          <button onClick={clearWalls}>Clear Walls</button>
          <button onClick={resetGrid}>Reset</button>
        </div>
      </div>
      <div className="stats">
        <div className="card">
          <h3>Algorithm</h3>
          <p>{stats.algorithm}</p>
        </div>
        <div className="card">
          <h3>Visited</h3>
          <p>{stats.visited}</p>
        </div>
        <div className="card">
          <h3>Path Length</h3>
          <p>{stats.path}</p>
        </div>
        <div className="card">
          <h3>Time</h3>
          <p>{stats.time} ms</p>
        </div>
      </div>

      <div className='grid-container'>
        {
          grid.map((row, i) =>
            <div className='row' key={i}>
              {
                row.map((node, j) => {
                  let extraClass = "";
                  if (node.isStart) {
                    extraClass = "start";
                  }
                  else if (node.isEnd) {
                    extraClass = "end";
                  }
                  else if (node.isWall) {
                    extraClass = "wall";
                  }
                  else if (node.isPath) {
                    extraClass = "path";
                  }
                  else if (node.visited) {
                    extraClass = "visited";
                  }
                  return (
                    <div
                      key={j}
                      onMouseDown={() => {

                        if (node.isStart) {
                          setDraggingStart(true);
                          return;
                        }

                        if (node.isEnd) {
                          setDraggingEnd(true);
                          return;
                        }

                        setMousePressed(true);
                        handleClick(node.row, node.col);

                      }}

                      onMouseEnter={() => {
                        if (draggingStart) {
                          moveStart(node.row, node.col);
                          return;
                        }
                        if (draggingEnd) {

                          moveEnd(node.row, node.col);
                          return;
                        }
                        if (mousePressed) {
                          handleClick(node.row, node.col);
                        }
                      }}
                      onMouseUp={() => {
                        setMousePressed(false);
                        setDraggingStart(false);
                        setDraggingEnd(false);

                      }}

                      className={`node ${extraClass}`}>

                    </div>

                  );
                })
              }

            </div>
          )}
      </div>

    </div>



  )
}

export default App
