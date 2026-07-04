function heuristic(node, end) {

    return Math.abs(node.row - end.row) +
        Math.abs(node.col - end.col);

}
function getNeighbors(node, grid) {

    const neighbors = [];

    const r = node.row;
    const c = node.col;

    if (r > 0)
        neighbors.push(grid[r - 1][c]);

    if (r < grid.length - 1)
        neighbors.push(grid[r + 1][c]);

    if (c > 0)
        neighbors.push(grid[r][c - 1]);

    if (c < grid[0].length - 1)
        neighbors.push(grid[r][c + 1]);

    return neighbors;

}

function updateNeighbors(node, grid, end) {

    const neighbors = getNeighbors(node, grid);

    for (let neighbor of neighbors) {

        if (neighbor.visited)
            continue;

        if (neighbor.isWall)
            continue;

        const distance = node.distance + 1;

        if (distance < neighbor.distance) {

            neighbor.distance = distance;

            neighbor.heuristic =
                heuristic(neighbor, end);

            neighbor.previous = node;

        }

    }

}

export function astar(grid, start, end) {

    start.distance = 0;

    start.heuristic =
        heuristic(start, end);

    const open = [];

    for (let row of grid) {

        for (let node of row) {

            node.distance = Infinity;
            node.visited = false;
            node.previous = null;

        }

    }

    start.distance = 0;
    start.heuristic =
        heuristic(start, end);

    for (let row of grid) {

        for (let node of row) {

            open.push(node);

        }

    }

    const visited = [];

    while (open.length) {

        open.sort((a, b) =>

            (a.distance + a.heuristic) -

            (b.distance + b.heuristic)

        );

        const current = open.shift();

        if (current.isWall)
            continue;

        if (current.distance === Infinity)
            break;

        current.visited = true;

        visited.push(current);

        if (current === end)
            break;

        updateNeighbors(
            current,
            grid,
            end
        );

    }

    return visited;

}