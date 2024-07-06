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

// RECURSIVE DIVISION ALGORITHM
function recdiv() {
    
}