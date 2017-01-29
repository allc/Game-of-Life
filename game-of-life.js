/*
 * configurations
 */
var rows = 50;
var cols = 50;

var cellSize = 10;

// board width and height are calculated
var boardWidth = rows * cellSize + 1;
var boardHeight = cols * cellSize + 1;

/*
 * setup board
 */
var board = document.getElementById('game-of-life');
// set size
board.width = boardWidth;
board.height = boardHeight;
// get canvas context
var ctx = board.getContext('2d');

/*
 * game model
 */
var cells = [];

function initiateCells() {
    for (var i = 0; i < rows * cols; i++) {
        cells[i] = Math.random() < 0.15 ? true : false;
    }
}

function stepCell() {
    var lastStepCells = [];
    for (var i = 0; i < rows * cols; i++) {
        lastStepCells[i] = cells[i];
    }
    
    for (var i = 0; i < rows * cols; i++) {
        var adjAliveCells = 0;
        var row = calcRow(i);
        var col = calcCol(i);
        var adjCells = [calcIndex(row - 1, col - 1), calcIndex(row - 1, col), calcIndex(row - 1, col + 1), calcIndex(row, col - 1), calcIndex(row, col + 1), calcIndex(row + 1, col - 1), calcIndex(row + 1, col), calcIndex(row + 1, col + 1)]
        // works only if larger than 2x2 in row and col
        var adjCellsIndexs = [];
        if (row == 0) {
            if (col == 0) { // left-top
                adjCellsIndexs = [4, 6, 7];
            } else if (col == cols - 1) { // right-top
                adjCellsIndexs = [3, 5, 6];
            } else { // top
                adjCellsIndexs = [3, 4, 5, 6, 7];
            }
        } else if (row == rows - 1) {
            if (col == 0) { // left-bottom
                adjCellsIndexs = [2, 3, 5];
            } else if (col == cols - 1) { // right-bottom
                adjCellsIndexs = [0, 1, 3];
            } else { // bottom
                adjCellsIndexs = [0, 1, 2, 3, 4];
            }
        } else if (col == 0) { // left
            adjCellsIndexs = [1, 2, 4, 6, 7];
        } else if (col == cols - 1) { // right
            adjCellsIndexs = [0, 1, 3, 5, 6];
        } else { //middle
            adjCellsIndexs = [0, 1, 2, 3, 4, 5, 6, 7];
        }
        // count adjacent alive cells
        for (var j = 0; j < adjCellsIndexs.length; j++) {
            if (lastStepCells[adjCells[adjCellsIndexs[j]]]) {
                adjAliveCells++;
            }
        }
        if (cells[i]) { // current cell alive
            if (adjAliveCells < 2 || adjAliveCells > 3) {
                cells[i] = false;
            }
        } else { // current cell not alive
            if (adjAliveCells == 3) {
                cells[i] = true;
            }
        }
    }
}

/*
 * draw cells
 */
function draw() {
    ctx.lineWidth = '1';
    for (var i = 0; i < rows * cols; i++) {
        if (cells[i]) {
            ctx.fillRect(calcCol(i) * cellSize + 0.5, calcRow(i) * cellSize + 0.5, cellSize, cellSize);
        } else {
            ctx.clearRect(calcCol(i) * cellSize + 0.5, calcRow(i) * cellSize + 0.5, cellSize, cellSize);
            ctx.rect(calcCol(i) * cellSize + 0.5, calcRow(i) * cellSize + 0.5, cellSize, cellSize);
        }
    }
    ctx.stroke();
}

function calcRow(i) {
    return Math.floor(i / cols);
}

function calcCol(i) {
    return i % cols;
}

function calcIndex(row, col) {
    return row * cols + col;
}

/*
 * simulation
 */
initiate();

var isRunning = false;
var runInterval;

function initiate() {
    stop();
    initiateCells();
    draw();
}

function step() {
    stepCell();
    draw();
}

function buttonStep() {
    if (!isRunning) {
        step();
    }
}

function run() {
    if (!isRunning) {
        isRunning = true;
        runInterval= setInterval(step, 300);
    }
}

function stop() {
    clearInterval(runInterval);
    isRunning = false;
}