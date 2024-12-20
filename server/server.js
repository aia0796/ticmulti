const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

// Import socket logic
require('./socket')(io);

const PORT = process.env.PORT || 3200;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});