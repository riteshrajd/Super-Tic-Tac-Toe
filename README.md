# Super Tic-Tac-Toe Online

A real-time, online multiplayer implementation of the classic Super Tic-Tac-Toe game, built with React and Socket.IO. Challenge your friends in a strategic battle across nine interconnected boards!

## Table of Contents

- [About Super Tic-Tac-Toe](#about-super-tic-tac-toe)
- [Features](#features)
- [Live Demo](#live-demo)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Clone the Repository](#clone-the-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the Applications](#running-the-applications)
- [How to Play](#how-to-play)
- [Project Structure](#project-structure)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## About Super Tic-Tac-Toe

Super Tic-Tac-Toe (also known as Ultimate Tic-Tac-Toe) takes the traditional game to the next level. Instead of one 3x3 grid, you play on a 3x3 grid of smaller 3x3 grids.

**Key Rule:** When a player makes a move in a small grid, the opponent must play in the large grid corresponding to the cell played. For example, if Player X plays in the top-right cell of any small grid, Player O must then play in the top-right small grid of the main board.

To win the game, a player must win three small grids in a row, column, or diagonal on the main board.

## Features

- **Online Multiplayer:** Play against friends or other players in real-time.
- **Room System:** Create or join private game rooms.
- **Super Tic-Tac-Toe Rules:** Full implementation of the meta-game logic, including forced moves to specific sub-boards.
- **Responsive Design:** Play seamlessly on various screen sizes (mobile, tablet, desktop).
- **Visual Feedback:**
  - Pulsing border highlights the currently active sub-board.
  - Clear "X" or "O" marking on cells.
  - Sub-board wins/draws are prominently displayed with a delay, showing a large "X", "O", or "DRAW" over the sub-grid.
  - Overall game win/loss/draw conditions.
- **Intuitive UI:** Clean and modern design for an engaging experience.
- **Real-time Communication:** Powered by Socket.IO for instant updates.

## Live Demo

- **Frontend:** [https://super-tictac-toe.netlify.app/](https://super-tictac-toe.netlify.app/)

## Technologies Used

### Frontend

- **React.js:** A JavaScript library for building user interfaces.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Socket.IO Client:** For real-time bidirectional communication with the backend.

### Backend

- **Node.js:** JavaScript runtime.
- **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
- **Socket.IO Server:** For real-time, event-based communication.
- **CORS:** Middleware to enable Cross-Origin Resource Sharing.

## Installation

### Prerequisites

- Node.js (LTS version recommended)
- npm (Node Package Manager) or yarn

### Clone the Repository

```bash
git clone <your-repository-url> # Replace with your actual repo URL
cd super-tic-tac-toe-game       # Or whatever your main project folder is named
```

This project typically consists of two main folders: `client` (for frontend) and `server` (for backend).

### Backend Setup

1. Navigate into the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install # or yarn
   ```

3. Create a `.env` file in the `server` directory for environment variables:
   ```dotenv
   PORT=3000
   ORIGIN=http://localhost:5173 # For local development
   # When deploying, update this to your frontend's deployed URL, e.g.:
   # ORIGIN=https://super-tictac-toe.netlify.app
   ```
   *Note: If deploying to a platform like Render, they often set their own `PORT` environment variable, so `process.env.PORT || 3000` is good practice. The `ORIGIN` variable should be updated to your deployed frontend URL when deploying.*

4. Ensure your `socket.io` server is configured for CORS to allow your frontend's origin:
   ```javascript
   // In your backend server.js or app.js
   const io = require('socket.io')(server, {
     cors: {
       origin: process.env.ORIGIN, // Dynamically set from .env
       methods: ["GET", "POST"]
     }
   });
   ```

### Frontend Setup

1. Navigate back to the root of the project, then into the `client` directory:
   ```bash
   cd ../client
   ```

2. Install frontend dependencies:
   ```bash
   npm install # or yarn
   ```

3. Create a `.env` file in the `client` directory to store your backend's URL:
   ```
   VITE_BACKEND_URL=http://localhost:3000 # Adjust if your backend runs on a different port
   # For deployment, this would be:
   # VITE_BACKEND_URL=https://super-tic-tac-toe-backend.onrender.com
   ```

### Running the Applications

1. **Start the Backend Server:**
   In the `server` directory:

   ```bash
   npm start # or node server.js (or whatever your entry file is)
   ```

   The server will typically start on `http://localhost:3000` (or your specified port).

2. **Start the Frontend Development Server:**
   In the `client` directory:

   ```bash
   npm run dev # or yarn dev
   ```

   This will usually open your React app at `http://localhost:5173` (or similar, check your terminal output).

Open `http://localhost:5173` in your browser to start playing!

## How to Play

1. **Access the Game:** Open the frontend URL in your browser.
2. **Enter Name & Room:** Enter your desired player name and either create a new room name or enter an existing one to join.
3. **Wait for Opponent:** Once you join a room, wait for another player to join the same room.
4. **Start Playing:**
   - You'll be assigned "X" or "O" and notified if it's your turn.
   - The **pulsing border** indicates the active sub-grid where you *must* make your next move.
   - Click on an empty cell within the active sub-grid.
   - Your move will force your opponent to play in the sub-grid corresponding to the cell you just played (e.g., if you played in the center cell of a sub-grid, they must play in the central sub-grid).
   - If a sub-grid is already won or drawn, the opponent can play in *any* available sub-grid.
   - Win a small grid by getting three of your marks in a row (horizontally, vertically, or diagonally). The sub-grid will then display a large "X", "O", or "DRAW".
   - Win the overall game by winning three small grids in a row on the main board.

## Future Enhancements

- **Spectator Mode:** Allow users to watch ongoing games.
- **Match History:** Track wins/losses for registered users.
- **Global Leaderboard:** Display top players.
- **AI Opponent:** Implement a bot to play against.
- **Improved UI/UX:** More animations, sound effects, and visual cues.
- **User Authentication:** Allow user accounts and persistent profiles.
- **Public Game Lobby:** List available rooms for easier joining.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgements

- Inspired by the classic game Super Tic-Tac-Toe.
- Built with the excellent React and Socket.IO libraries.