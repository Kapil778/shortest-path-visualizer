function updateNeighbors(node, grid) {

    const neighbors =
        getNeighbors(node, grid);

    for (let neighbor of neighbors) {

        if (neighbor.visited)
            continue;

        const distance =
            node.distance + 1;

        if (distance < neighbor.distance) {

            neighbor.distance =
                distance;

            neighbor.previous = node;

        }
    }
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
export function dijkstra(grid, start, end) {


    const unvisited = [];
    for (let row of grid) {
        for (let node of row) {

            node.distance = Infinity;
            node.visited = false;
            node.previous = null;

        }
    }
    start.distance = 0;
    for (let row of grid) {
        for (let node of row) {
            unvisited.push(node);
        }
    }

    const visitedNodes = [];

    while (unvisited.length) {

        unvisited.sort(
            (a, b) => a.distance - b.distance
        );

        const closest = unvisited.shift();

        if (closest.isWall) continue;

        if (closest.distance === Infinity) break;

        closest.visited = true;

        visitedNodes.push(closest);

        if (
            closest.row === end.row && closest.col == end.col
        )
            break;

        updateNeighbors(
            closest,
            grid
        );

    }

    return visitedNodes;
}