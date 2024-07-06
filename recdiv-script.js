// Set up canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Adjust size to ensure all cells are roughly the same size
var baseSize = 20;
var size = Math.min(canvas.width, canvas.height);
var cols = Math.floor(canvas.width / baseSize);
var rows = Math.floor(canvas.height / baseSize);
size = Math.min(Math.floor(canvas.width / cols), Math.floor(canvas.height / rows)); // Adjust size to fit both dimensions

const grid = [];

// RECURSIVE DIVISION
function recdiv(startX = 0, startY = 0, endX = cols - 1, endY = rows - 1, delay = 300) {
    setTimeout(() => {
        let width = endX - startX + 1;
        let height = endY - startY + 1;

        if (width < 2 || height < 2) {
            return;
        }

        let divideHorizontally = width < height;
        let wall, passage;

        if (divideHorizontally) {
            wall = Math.floor(Math.random() * (height - 1)) + startY;
            passage = Math.floor(Math.random() * width) + startX;
            for (let i = startX; i <= endX; i++) {
                if (i !== passage) {
                    grid[wall * cols + i].walls[2] = false;
                    grid[(wall + 1) * cols + i].walls[0] = false;
                }
            }
            visualizeMaze();
            recdiv(startX, startY, endX, wall, delay);
            recdiv(startX, wall + 1, endX, endY, delay);
        } else {
            wall = Math.floor(Math.random() * (width - 1)) + startX;
            passage = Math.floor(Math.random() * height) + startY;
            for (let i = startY; i <= endY; i++) {
                if (i !== passage) {
                    grid[i * cols + wall].walls[1] = false;
                    grid[i * cols + wall + 1].walls[3] = false;
                }
            }
            visualizeMaze();
            recdiv(startX, startY, wall, endY, delay);
            recdiv(wall + 1, startY, endX, endY, delay);
        }
    }, delay);
}

function visualizeMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let cell of grid) {
        let x = cell.x * baseSize;
        let y = cell.y * baseSize;
        ctx.beginPath();
        if (cell.walls[0]) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + baseSize, y);
        }
        if (cell.walls[1]) {
            ctx.moveTo(x + baseSize, y);
            ctx.lineTo(x + baseSize, y + baseSize);
        }
        if (cell.walls[2]) {
            ctx.moveTo(x + baseSize, y + baseSize);
            ctx.lineTo(x, y + baseSize);
        }
        if (cell.walls[3]) {
            ctx.moveTo(x, y + baseSize);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function recursiveDivision() {
    grid.length = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            grid.push({ x, y, visited: false, walls: [true, true, true, true] }); // Top, right, bottom, left
        }
    }
    recdiv();
}

document.querySelector('#lineWidth').addEventListener('change', function() {
    ctx.lineWidth = this.value;
});

document.querySelector('#cellSize').addEventListener('change', function() {
    baseSize = parseInt(this.value);
    cols = Math.floor(canvas.width / baseSize);
    rows = Math.floor(canvas.height / baseSize);
    size = Math.min(Math.floor(canvas.width / cols), Math.floor(canvas.height / rows));
});

document.querySelector('#speed').addEventListener('change', function() {
    recdiv(0, 0, cols - 1, rows - 1, parseInt(this.value));
});