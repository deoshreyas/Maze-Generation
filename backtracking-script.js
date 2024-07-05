// Set up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var cell_size = 40;
const size = Math.min(window.innerWidth, window.innerHeight) / Math.min(Math.floor(window.innerWidth / cell_size), Math.floor(window.innerHeight / cell_size)); // Adjusted size to maintain square cells
const cols = Math.floor(canvas.width / size);
const rows = Math.floor(canvas.height / size);

// Initialize maze grid
const grid = [];
for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
        grid.push({ x, y, visited: false, walls: [true, true, true, true] }); // Top, right, bottom, left
    }
}

// Get grid index
function index(x, y) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
        return -1;
    }
    return x + y * cols;
}

// Get unvisited neighbours
function getUnvisitedNeighbors(cell) {
    const neighbors = [];
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Top, right, bottom, left
    directions.forEach(([dx, dy], i) => {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        const ni = index(nx, ny);
        if (ni !== -1 && !grid[ni].visited) {
            neighbors.push({ cell: grid[ni], wallIndex: i });
        }
    });
    return neighbors;
}

// Remove wall between two cells
function removeWall(current, next, wallIndex) {
    current.walls[wallIndex] = false;
    next.walls[(wallIndex + 2) % 4] = false; // Opposite wall
}

// Draw the maze
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw top wall of the first row and left wall of the first column
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0); // Top wall
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height); // Left wall
    ctx.stroke();

    grid.forEach(cell => {
        const x = cell.x * size;
        const y = cell.y * size;
        ctx.lineWidth = 5;
        // Draw only the bottom and right walls to avoid overlapping lines
        if (cell.walls[2]) { // Bottom wall
            ctx.beginPath();
            ctx.moveTo(x, y + size);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
        if (cell.walls[1]) { // Right wall
            ctx.beginPath();
            ctx.moveTo(x + size, y);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
    });
}

// BACKTRACKING ALGORITHM with visualization
async function backtrack() {
    const stack = [];
    const startCell = grid[0];
    startCell.visited = true;
    stack.push(startCell);

    function animate() {
        if (stack.length > 0) {
            requestAnimationFrame(animate);
            const current = stack[stack.length - 1];
            const neighbors = getUnvisitedNeighbors(current);

            if (neighbors.length > 0) {
                const { cell: next, wallIndex } = neighbors[Math.floor(Math.random() * neighbors.length)];
                next.visited = true;
                removeWall(current, next, wallIndex);
                stack.push(next);
            } else {
                stack.pop();
            }
            draw(); 
        }
    }

    animate();
}