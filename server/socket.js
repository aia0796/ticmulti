const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

module.exports = function(io) {
    let rooms = {};

    io.on('connection', (socket) => {
        console.log('New user connected: ' + socket.id);

        socket.on('createRoom', (roomName) => {
            if (!roomName) {
                roomName = `room-${Math.random().toString(36).substr(2, 9)}`;
            }
            if (!rooms[roomName]) {
                rooms[roomName] = { players: [], board: Array(9).fill(null), currentPlayer: null };
                socket.join(roomName);
                rooms[roomName].players.push(socket.id);
                socket.emit('roomCreated', roomName);
                console.log('Room created: ' + roomName);
            } else {
                socket.emit('roomExists', roomName);
            }
        });

        socket.on('joinRoom', (roomName) => {
            if (rooms[roomName] && rooms[roomName].players.length < 2) {
                socket.join(roomName);
                rooms[roomName].players.push(socket.id);
                rooms[roomName].currentPlayer = rooms[roomName].players[0];
                socket.emit('joinedRoom', roomName);
                io.to(roomName).emit('playerJoined', rooms[roomName].players);
                console.log('User joined room: ' + roomName);
            } else {
                socket.emit('roomFull', roomName);
            }
        });

        socket.on('makeMove', (roomName, index) => {
            const room = rooms[roomName];
            if (room && room.board[index] === null && socket.id === room.currentPlayer) {
                room.board[index] = room.players.indexOf(socket.id);
                room.currentPlayer = room.players[1 - room.players.indexOf(socket.id)];
                io.to(roomName).emit('moveMade', room.board, room.currentPlayer);
                checkWinner(room, roomName);
            }
        });

        socket.on('disconnect', () => {
            for (const roomName in rooms) {
                const room = rooms[roomName];
                const index = room.players.indexOf(socket.id);
                if (index !== -1) {
                    room.players.splice(index, 1);
                    if (room.players.length === 0) {
                        delete rooms[roomName];
                    } else {
                        io.to(roomName).emit('playerLeft', socket.id);
                    }
                    break;
                }
            }
        });
    });

    function checkWinner(room, roomName) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (room.board[a] !== null && room.board[a] === room.board[b] && room.board[a] === room.board[c]) {
                io.to(roomName).emit('gameOver', room.players[room.board[a]], room.board);
                return;
            }
        }
        if (room.board.every(cell => cell !== null)) {
            io.to(roomName).emit('gameOver', 'draw', room.board);
        }
    }
}

server.listen(6000, () => {
    console.log('Socket.IO server running on port 6000');
});