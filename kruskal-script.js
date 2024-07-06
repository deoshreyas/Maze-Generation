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

// Initialize maze grid
const grid = [];

var delay = 50;

// Get grid index
function index(x, y) {
    if (x < 0 || y < 0 || x >= cols || y >= rows) {
        return -1;
    }
    return x + y * cols;
}

// RANDOMISED KRUSKAL'S ALGORITH
function kruskal_algo() {
    let sets = grid.map((_, i) => new Set([i])); // Initialize sets
    let walls = [];

    grid.forEach((cell, index) => {
        if (cell.x < cols - 1) walls.push({a: index, b: index + 1});
        if (cell.y < rows - 1) walls.push({a: index, b: index + cols});
    });

    walls.sort(() => Math.random() - 0.5); // Shuffle walls

    function processWalls(i) {
        if (i < walls.length) {
            let wall = walls[i];
            let a = findSet(sets, wall.a);
            let b = findSet(sets, wall.b);

            if (a !== b) {
                removeWall(grid[wall.a], grid[wall.b]);
                unionSets(sets, a, b);
                visualizeStep();
            }
            setTimeout(() => processWalls(i + 1), delay); 
        }
    }

    processWalls(0);
}

function kruskal() {
    grid.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push({ x, y, visited: false, walls: [true, true, true, true] }); // Top, right, bottom, left
        }
    }
    kruskal_algo();
}

// Find the set that contains the cell
function findSet(sets, index) {
    return sets.findIndex(set => set.has(index));
}

// Union two sets
function unionSets(sets, a, b) {
    sets[a].forEach(val => sets[b].add(val));
    sets[a] = new Set();
}

// Remove the wall between two cells
function removeWall(cell1, cell2) {
    let dx = cell1.x - cell2.x;
    let dy = cell1.y - cell2.y;
    if (dx === 1) { 
        cell1.walls[3] = false;
        cell2.walls[1] = false;
    } else if (dx === -1) { 
        cell1.walls[1] = false;
        cell2.walls[3] = false;
    }
    if (dy === 1) { 
        cell1.walls[0] = false;
        cell2.walls[2] = false;
    } else if (dy === -1) { 
        cell1.walls[2] = false;
        cell2.walls[0] = false;
    }
}

function visualizeStep() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    grid.forEach(drawCell); 
}

function drawCell(cell) {
    const x = cell.x * size;
    const y = cell.y * size;
    ctx.beginPath();
    if (cell.walls[0]) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
    }
    if (cell.walls[1]) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
    }
    if (cell.walls[2]) {
        ctx.moveTo(x + size, y + size);
        ctx.lineTo(x, y + size);
    }
    if (cell.walls[3]) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
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