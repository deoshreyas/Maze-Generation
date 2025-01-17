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

var delay = 1;

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
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
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
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    grid.forEach(cell => {
        const x = cell.x * size;
        const y = cell.y * size;
        if (cell.walls[2]) { 
            ctx.beginPath();
            ctx.moveTo(x, y + size);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
        if (cell.walls[1]) {
            ctx.beginPath();
            ctx.moveTo(x + size, y);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
        }
    });
}

// BACKTRACKING ALGORITHM
let animationFrameId = null;
let timeoutId = null; 

async function backtrack_algo() {
    const stack = [];
    const startCell = grid[0];
    startCell.visited = true;
    stack.push(startCell);

    function animate() {
        if (stack.length > 0) {
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
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                animationFrameId = requestAnimationFrame(animate);
            }, delay); 
        }
    }
    animate();
}

function backtrack() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId); // Cancel ongoing animation
        animationFrameId = null;
    }
    if (timeoutId !== null) {
        clearTimeout(timeoutId); // Clear timeout
        timeoutId = null;
    }
    grid.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push({ x, y, visited: false, walls: [true, true, true, true] });
        }
    }
    backtrack_algo();
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