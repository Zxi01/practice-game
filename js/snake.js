// Game configuration
const GAME_CONFIG = {
    blockSize: 20,
    rows: 30,
    cols: 30,
    fps: 10,
    startX: 5,
    startY: 5,
};

// Board
let board;
let context;

// Snake head
let snakeX = GAME_CONFIG.blockSize * GAME_CONFIG.startX;
let snakeY = GAME_CONFIG.blockSize * GAME_CONFIG.startY;

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
let gameOverHandled = false;

// score
let score = 0;

function updateScore() {
    const el = document.getElementById("score");
    if (el) el.textContent = String(score);
}

// Drawing functions
function drawBoard() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
}

function drawFood() {
    context.fillStyle = "red";
    context.fillRect(
        foodX,
        foodY,
        GAME_CONFIG.blockSize,
        GAME_CONFIG.blockSize
    );
}

function drawSnake() {
    context.fillStyle = "lime";
    context.fillRect(
        snakeX,
        snakeY,
        GAME_CONFIG.blockSize,
        GAME_CONFIG.blockSize
    );
    snakeBody.forEach(([x, y]) => {
        context.fillRect(x, y, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
    });
}

window.onload = function () {
    board = document.getElementById("snake-canvas");
    board.height = GAME_CONFIG.rows * GAME_CONFIG.blockSize;
    board.width = GAME_CONFIG.cols * GAME_CONFIG.blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keydown", changeDirection);

    // D-pad button event listeners to ensure the buttons are found after DOM loads
    document
        .getElementById("dpad-up")
        ?.addEventListener("click", () => setDirection("Up"));
    document
        .getElementById("dpad-down")
        ?.addEventListener("click", () => setDirection("Down"));
    document
        .getElementById("dpad-left")
        ?.addEventListener("click", () => setDirection("Left"));
    document
        .getElementById("dpad-right")
        ?.addEventListener("click", () => setDirection("Right"));

    setInterval(update, 1000 / GAME_CONFIG.fps);
    updateScore();
};

function update() {
    if (gameOver) {
        if (!gameOverHandled) {
            gameOverHandled = true;
            handleGameOver();
        }
        return;
    }

    drawBoard();
    drawFood();

    // Check if snake ate food
    if (snakeX === foodX && snakeY === foodY) {
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

    // Move the snake head
    snakeX += velocityX * GAME_CONFIG.blockSize;
    snakeY += velocityY * GAME_CONFIG.blockSize;

    // Check for wall collision
    if (
        snakeX < 0 ||
        snakeX >= GAME_CONFIG.cols * GAME_CONFIG.blockSize ||
        snakeY < 0 ||
        snakeY >= GAME_CONFIG.rows * GAME_CONFIG.blockSize
    ) {
        gameOver = true;
    }

    // Check for self-collision
    if (snakeBody.some(([x, y]) => x === snakeX && y === snakeY)) {
        gameOver = true;
    }

    // Draw the snake if game is still active
    if (!gameOver) {
        drawSnake();
    }
}

function handleGameOver() {
    const modal = document.getElementById("game-over-modal");
    const scoreEl = document.getElementById("final-score");
    scoreEl.textContent = score;
    modal.classList.remove("hidden");

    document.getElementById("restart-btn").onclick = () => {
        modal.classList.add("hidden");
        resetGame();
    };

    document.getElementById("home-btn").onclick = () => {
        window.location.href = "index.html";
    };
}

// dpad and keyboard controls
// Helper function to set direction with reverse prevention
function setDirection(direction) {
    switch (direction) {
        case "Up":
            if (lastDirection !== "Down") {
                velocityX = 0;
                velocityY = -1;
                lastDirection = "Up";
            }
            break;
        case "Down":
            if (lastDirection !== "Up") {
                velocityX = 0;
                velocityY = 1;
                lastDirection = "Down";
            }
            break;
        case "Left":
            if (lastDirection !== "Right") {
                velocityX = -1;
                velocityY = 0;
                lastDirection = "Left";
            }
            break;
        case "Right":
            if (lastDirection !== "Left") {
                velocityX = 1;
                velocityY = 0;
                lastDirection = "Right";
            }
            break;
    }
}

function changeDirection(e) {
    // Prevent arrow keys from scrolling the page
    const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const wasdKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];
    if ([...arrowKeys, ...wasdKeys].includes(e.code)) {
        e.preventDefault();
    }

    switch (e.code) {
        case "ArrowUp":
        case "KeyW":
            setDirection("Up");
            break;
        case "ArrowDown":
        case "KeyS":
            setDirection("Down");
            break;
        case "ArrowLeft":
        case "KeyA":
            setDirection("Left");
            break;
        case "ArrowRight":
        case "KeyD":
            setDirection("Right");
            break;
    }
}

function placeFood() {
    let valid = false;
    while (!valid) {
        foodX =
            Math.floor(Math.random() * GAME_CONFIG.cols) *
            GAME_CONFIG.blockSize;
        foodY =
            Math.floor(Math.random() * GAME_CONFIG.rows) *
            GAME_CONFIG.blockSize;
        valid = !snakeBody.some(([x, y]) => x === foodX && y === foodY);
    }
}

function resetGame() {
    snakeX = GAME_CONFIG.blockSize * GAME_CONFIG.startX;
    snakeY = GAME_CONFIG.blockSize * GAME_CONFIG.startY;
    velocityX = 0;
    velocityY = 0;
    lastDirection = "";
    snakeBody = [];
    gameOver = false;
    gameOverHandled = false;
    score = 0;
    updateScore();
    placeFood();
}
