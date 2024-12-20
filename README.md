# Multiplayer Tic Tac Toe

This project is a real-time multiplayer Tic Tac Toe game built using Node.js, Socket.IO, HTML, CSS, and JavaScript. Players can create and join game rooms to compete against each other.

## Project Structure

```
multiplayer-tictactoe
├── public
│   ├── index.html       # HTML structure for the game
│   ├── styles.css       # CSS styles for the game
│   └── script.js        # Client-side JavaScript logic
├── server
│   ├── server.js        # Entry point for the Node.js server
│   └── socket.js        # Socket.IO event handlers
├── package.json         # npm configuration file
├── README.md            # Project documentation
└── .gitignore           # Files to ignore by Git
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd multiplayer-tictactoe
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the server:**
   ```
   node server/server.js
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to access the game.

## Usage

- **Create Room:** Click the "Create Room" button to start a new game room.
- **Join Room:** Enter the room ID to join an existing game room.
- **Play the Game:** Players take turns to place their marks on the game board.
- **Winner Announcement:** The game will automatically announce the winner or if there is a draw.

## Technologies Used

- Node.js
- Express
- Socket.IO
- HTML
- CSS
- JavaScript

## License

This project is licensed under the MIT License.