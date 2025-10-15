var blockSize = 20;
var rows = 30;
var cols = 30;
var board;
var context;

window.onload = function () {
    board = document.getElementById("spaceinvaders-canvas");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); // used for drawing on the board

    update();
};

function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    requestAnimationFrame(update);
}
