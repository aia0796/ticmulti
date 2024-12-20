document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    let currentPlayer = 'X';
    let roomId = '';
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let playerNames = {};
    let leaderboard = { draws: 0 };

    document.getElementById('createRoom').addEventListener('click', () => {
        const roomName = document.getElementById('roomInput').value;
        socket.emit('createRoom', roomName);
    });

    document.getElementById('joinRoom').addEventListener('click', () => {
        const roomName = document.getElementById('roomInput').value;
        socket.emit('joinRoom', roomName);
    });

    document.getElementById('playAgain').addEventListener('click', () => {
        resetGame();
        document.getElementById('playAgain').style.display = 'none';
    });

    socket.on('roomCreated', (room) => {
        roomId = room;
        gameActive = true;
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('roomName').textContent = roomId;
        playerNames[socket.id] = 'X';
        showNotification(`Room created: ${roomId}`);
    });

    socket.on('joinedRoom', (room) => {
        roomId = room;
        gameActive = true;
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('roomName').textContent = roomId;
        playerNames[socket.id] = 'O';
        showNotification(`Joined room: ${roomId}`);
    });

    socket.on('playerJoined', (players) => {
        players.forEach(player => {
            if (!playerNames[player]) {
                playerNames[player] = playerNames[socket.id] === 'X' ? 'O' : 'X';
            }
        });
        document.getElementById('playerInfo').textContent = `You: ${playerNames[socket.id]}, Opponent: ${players.filter(player => player !== socket.id).map(player => playerNames[player]).join(', ')}`;
    });

    socket.on('moveMade', (newBoard, currentPlayer) => {
        board = newBoard;
        updateBoard();
        document.getElementById('status').textContent = `Current Player: ${playerNames[currentPlayer]}`;
    });

    socket.on('gameOver', (winner, finalBoard) => {
        board = finalBoard;
        updateBoard();
        if (winner === 'draw') {
            showNotification("It's a draw!");
            updateLeaderboard('draws');
        } else {
            showNotification(`Player ${playerNames[winner]} wins!`);
            updateLeaderboard(playerNames[winner]);
        }
        setTimeout(() => {
            showNotification("Resetting game in 5 seconds...");
            setTimeout(resetGame, 5000);
        }, 1000);
        document.getElementById('playAgain').style.display = 'block';
    });

    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            makeMove(index);
        });
    });

    function makeMove(index) {
        if (gameActive && !board[index]) {
            board[index] = currentPlayer;
            socket.emit('makeMove', roomId, index);
            updateBoard();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('status').textContent = `Current Player: ${currentPlayer}`;
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = board[index] === 0 ? 'X' : board[index] === 1 ? 'O' : '';
        });
    }

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function updateLeaderboard(winner) {
        if (!leaderboard[winner]) {
            leaderboard[winner] = 0;
        }
        leaderboard[winner]++;
        const leaderboardContent = document.getElementById('leaderboardContent');
        leaderboardContent.innerHTML = Object.entries(leaderboard).map(([name, wins]) => `<div>${name}: ${wins} wins</div>`).join('');
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        updateBoard();
        gameActive = true;
        currentPlayer = 'X';
        document.getElementById('status').textContent = `Current Player: ${currentPlayer}`;
        document.getElementById('playAgain').style.display = 'none';
    }
});