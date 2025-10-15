// board
const blockSize = 20;
const rows = 30;
const cols = 30;
let board;
let context;

// snake head
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let velocityX = 0;
let velocityY = 0;

// Track last direction for preventing reverse moves
let lastDirection = "";

// snake body
let snakeBody = [];

// food
let foodX;
let foodY;

let gameOver = false;

// score
let score = 0;

function updateScore() {
    const el = document.getElementById("score");
    if (el) el.textContent = String(score);
}

window.onload = function () {
    board = document.getElementById("snake-canvas");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // used for drawing on the board

    placeFood();
    document.addEventListener("keydown", changeDirection);
    setInterval(update, 1000 / 10); // 10 FPS
    updateScore();
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
        score += 1;
        updateScore();
        placeFood();
    }

    // Update body segments first (before moving head)
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    // Moving the head
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    lastDirection =
        velocityX === 1
            ? "Right"
            : velocityX === -1
            ? "Left"
            : velocityY === 1
            ? "Down"
            : velocityY === -1
            ? "Up"
            : lastDirection;

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
        handleGameOver();
    }
}

function handleGameOver() {
    setTimeout(() => {
        const restart = confirm(
            "Game Over!\n\nClick OK to restart.\nClick Cancel to choose another option."
        );
        if (restart) {
            resetGame();
        } else {
            const goHome = confirm("Would you like to return to the homepage?");
            if (goHome) {
                window.location.href = "index.html";
            }
        }
    }, 100);
}

function changeDirection(e) {
    // Prevent arrow keys from scrolling the page
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault();
    }

    switch (e.code) {
        case "ArrowUp":
            if (lastDirection !== "Down") {
                velocityX = 0;
                velocityY = -1;
            }
            break;
        case "ArrowDown":
            if (lastDirection !== "Up") {
                velocityX = 0;
                velocityY = 1;
            }
            break;
        case "ArrowLeft":
            if (lastDirection !== "Right") {
                velocityX = -1;
                velocityY = 0;
            }
            break;
        case "ArrowRight":
            if (lastDirection !== "Left") {
                velocityX = 1;
                velocityY = 0;
            }
            break;
    }
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
    lastDirection = "";
    snakeBody = [];
    gameOver = false;
    score = 0;
    updateScore();
    placeFood();
}
