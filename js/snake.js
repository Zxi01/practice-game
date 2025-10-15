// board
const blockSize = 20;
const rows = 30;
const cols = 30;
let board;
let context;

// snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

// snake body
var snakeBody = [];

// food
var foodX;
var foodY;

var gameOver = false;

window.onload = function () {
    board = document.getElementById("snake-canvas");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // used for drawing on the board

    placeFood();
    document.addEventListener("keydown", changeDirection);
    //update();
    setInterval(update, 1000 / 10); // 10 frames per second
};

function update() {
    if (gameOver) {
        return;
    }
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
    }

    // Update body segments first (before moving head)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Now move the head
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;

    // game over conditions - check wall collision
    if (
        snakeX < 0 ||
        snakeX >= cols * blockSize ||
        snakeY < 0 ||
        snakeY >= rows * blockSize
    ) {
        gameOver = true;
    }

    // Check for self-collision
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }

    // Don't draw if game is over
    if (!gameOver) {
        // Draw the snake
        context.fillStyle = "lime";
        context.fillRect(snakeX, snakeY, blockSize, blockSize);
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(
                snakeBody[i][0],
                snakeBody[i][1],
                blockSize,
                blockSize
            );
        }
    }

    if (gameOver) {
        setTimeout(() => {
            if (confirm("Game Over. Restart?")) {
                resetGame();
            }
        }, 100);
    }
}

let lastDirection = "Right"; // or null initially

function changeDirection(e) {
    switch (e.code) {
        case "ArrowUp":
            if (lastDirection !== "Down") {
                velocityX = 0;
                velocityY = -1;
                lastDirection = "Up";
            }
            break;
        case "ArrowDown":
            if (lastDirection !== "Up") {
                velocityX = 0;
                velocityY = 1;
                lastDirection = "Down";
            }
            break;
        case "ArrowLeft":
            if (lastDirection !== "Right") {
                velocityX = -1;
                velocityY = 0;
                lastDirection = "Left";
            }
            break;
        case "ArrowRight":
            if (lastDirection !== "Left") {
                velocityX = 1;
                velocityY = 0;
                lastDirection = "Right";
            }
            break;
    }
    e.preventDefault();
}

function placeFood() {
    let valid = false;
    while (!valid) {
        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * rows) * blockSize;
        valid = !snakeBody.some(([x, y]) => x === foodX && y === foodY);
    }
}

function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    gameOver = false;
    placeFood();
}
