const socket = io();

let currentPlayer = 'X';
let roomId = '';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

document.getElementById('createRoom').addEventListener('click', () => {
    const roomName = document.getElementById('roomInput').value;
    socket.emit('createRoom', roomName);
});

document.getElementById('joinRoom').addEventListener('click', () => {
    const roomName = document.getElementById('roomInput').value;
    socket.emit('joinRoom', roomName);
});

socket.on('roomCreated', (room) => {
    roomId = room;
    gameActive = true;
    alert(`Room created: ${roomId}`);
});

socket.on('roomJoined', (room) => {
    roomId = room;
    gameActive = true;
    alert(`Joined room: ${roomId}`);
});

socket.on('playerMove', (data) => {
    board[data.index] = data.player;
    updateBoard();
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
});

socket.on('gameWon', (winner) => {
    alert(`Player ${winner} wins!`);
    resetGame();
});

function makeMove(index) {
    if (gameActive && !board[index]) {
        board[index] = currentPlayer;
        socket.emit('playerMove', { index, player: currentPlayer });
        updateBoard();
        checkWinner();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.textContent = board[index];
    });
}

function checkWinner() {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            socket.emit('gameWon', currentPlayer);
            return;
        }
    }

    if (!board.includes('')) {
        alert("It's a draw!");
        resetGame();
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    updateBoard();
    gameActive = false;
}