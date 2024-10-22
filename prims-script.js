// Set up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust size to ensure all cells are roughly the same size
var baseSize = 40;
var size = Math.min(canvas.width, canvas.height);
var cols = Math.floor(canvas.width / baseSize);
var rows = Math.floor(canvas.height / baseSize);
size = Math.min(Math.floor(canvas.width / cols), Math.floor(canvas.height / rows)); // Adjust size to fit both dimensions

const grid = [];

var delay = 50;

// Get grid index
function index(x, y) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
        return -1;
    }
    return x + y * cols;
}

// Get the neighboring cells with at least one wall between them
function getNeighbors(cell) {
    const neighbors = [];
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; 
    directions.forEach(([dx, dy], i) => {
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows && !grid[index(nx, ny)].visited) {
            neighbors.push({ cell: grid[index(nx, ny)], wallIndex: i });
        }
    });
    return neighbors;
}

// Delay for visuals
function delay_wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// PRIM'S ALGORITHM
async function prims_algo() {
    let current = grid[0];
    current.visited = true;
    let walls = getNeighbors(current).map(n => ({ ...n, from: current }));

    while (walls.length > 0) {
        const randomWallIndex = Math.floor(Math.random() * walls.length);
        const { cell, wallIndex, from } = walls[randomWallIndex];
        if (!cell.visited) {
            cell.visited = true;
            removeWall(from, cell, wallIndex);
            const newWalls = getNeighbors(cell).map(n => ({ ...n, from: cell }));
            walls = walls.concat(newWalls);
            draw(); // Draw the maze after each step
            await delay_wait(delay); // Wait for 50ms before continuing to the next step
        }
        walls.splice(randomWallIndex, 1);
    }
}

function prims() {
    grid.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push({ x, y, visited: false, walls: [true, true, true, true] }); // Top, right, bottom, left
        }
    }
    prims_algo();
}

// Remove wall between two cells
function removeWall(current, next, wallIndex) {
    current.walls[wallIndex] = false;
    next.walls[(wallIndex + 2) % 4] = false; // Opposite wall
}

// Draw the maze
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(cell => {
        const x = cell.x * size;
        const y = cell.y * size;
        ctx.beginPath();
        if (cell.walls[0]) ctx.moveTo(x, y), ctx.lineTo(x + size, y);
        if (cell.walls[1]) ctx.moveTo(x + size, y), ctx.lineTo(x + size, y + size); 
        if (cell.walls[2]) ctx.moveTo(x + size, y + size), ctx.lineTo(x, y + size); 
        if (cell.walls[3]) ctx.moveTo(x, y + size), ctx.lineTo(x, y); 
        ctx.stroke();
    });
}

document.querySelector('#lineWidth').addEventListener('change', function() {
    if (this.value < 1) {
        this.value = 1;
    } else if (this.value > 10) {
        this.value = 10;
    }
    ctx.lineWidth = this.value;
});

document.querySelector('#cellSize').addEventListener('change', function() {
    if (this.value < 8) {
        this.value = 8;
    } else if (this.value > 100) {
        this.value = 100;
    }
    baseSize = parseInt(this.value);
    cols = Math.floor(canvas.width / baseSize);
    rows = Math.floor(canvas.height / baseSize);
    size = Math.min(Math.floor(canvas.width / cols), Math.floor(canvas.height / rows));
});

document.querySelector('#genDelay').addEventListener('change', function() {
    if (this.value < 1) {
        this.value = 1;
    } else if (this.value > 1000) {
        this.value = 1000;
    }
    delay = parseInt(this.value);
});

ctx.lineWidth = 2;