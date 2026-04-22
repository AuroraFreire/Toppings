const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const squareSize = 25;
const grid = [];
const colors = ["#FF69B4", "#FFD700", "#7FFFD4", "#FF4500", "#FFFFFF", "#9370DB"];

function initGrid() {
    grid.length = 0;
    const cols = Math.ceil(width / squareSize);
    const rows = Math.ceil(height / squareSize);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid.push({
                x: i * squareSize + (Math.random() * 10),
                y: j * squareSize + (Math.random() * 10),
                alpha: 0,
                fading: false,
                lastTouched: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI
            });
        }
    }
}

window.addEventListener("mousemove", (e) => {
    const col = Math.floor(e.clientX / squareSize);
    const row = Math.floor(e.clientY / squareSize);
    const rows = Math.ceil(height / squareSize);
    const index = col * rows + row;
    const cell = grid[index];
    if (cell) {
        cell.alpha = 1;
        cell.lastTouched = Date.now();
        cell.fading = false;
    }
});

window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initGrid();
});

function draw() {
    ctx.clearRect(0, 0, width, height);
    const now = Date.now();
    for (let i = 0; i < grid.length; i++) {
        const cell = grid[i];
        if (cell.alpha > 0 && !cell.fading && now - cell.lastTouched > 5) {
            cell.fading = true;
        }
        if (cell.fading) {
            cell.alpha -= 0.015;
            if (cell.alpha <= 0) {
                cell.alpha = 0;
                cell.fading = false;
            }
        }
        if (cell.alpha > 0) {
            ctx.save();
            ctx.translate(cell.x, cell.y);
            ctx.rotate(cell.rotation);
            ctx.globalAlpha = cell.alpha;
            ctx.fillStyle = cell.color;

            const w = 4;
            const h = 12;
            ctx.beginPath();
            ctx.roundRect(-w / 2, -h / 2, w, h, 2);
            ctx.fill();

            ctx.restore();
        }
    }
    requestAnimationFrame(draw);
}

initGrid();
draw();