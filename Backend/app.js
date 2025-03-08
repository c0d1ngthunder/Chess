const express = require("express");
const socket = require("socket.io");
const { Chess } = require("chess.js");
const path = require("path");
const http = require("http");
const cors = require("cors");

const app = express();

const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: "https://chess-frontend-dk5t.onrender.com",
  },
});

const chess = new Chess();
let players = {};
let currentplayer = "w";

class ChessClock {
  constructor(initialTime, displayElement) {
    this.time = initialTime; // Time in seconds
    this.displayElement = displayElement;
    this.interval = null;
    this.updateDisplay();
  }

  start() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if (this.time > 0) {
          this.time--;
          this.updateDisplay();
        } else {
          this.stop();
          alert("Time's up!");
        }
      }, 1000);
    }
  }

  stop() {
    clearInterval(this.interval);
    this.interval = null;
  }

  reset(newTime) {
    this.stop();
    this.time = newTime;
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    this.displayElement.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Running app");
});

io.on("connection", (uniquesocket) => {
  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
  } else {
    uniquesocket.emit("spectatorRole");
  }

  if (players.white && players.black) {
    io.emit("connected");
  }else{
    uniquesocket.emit("connecting");
  }

  uniquesocket.emit("boardState", chess.fen()); // Send latest board when someone connects

  uniquesocket.on("disconnect", () => {
    if (uniquesocket.id === players.white) {
      delete players.white;
      delete players.black;
      chess.reset();
      io.emit("Resign", "w");
      io.emit("connecting");
      io.emit("boardState", chess.fen());
    } else if (uniquesocket.id === players.black) {
      delete players.black;
      delete players.white;
      chess.reset();
      io.emit("Resign", "b");
      io.emit("connecting");
      io.emit("boardState", chess.fen());
    }
  });

  uniquesocket.on("move", (move) => {
    if (players.white && players.black) {
      try {
        if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
        if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

        let response = chess.move(move);
        if (response) {
          currentplayer = chess.turn();
          io.emit("move", move);
          io.emit("boardState", chess.fen());
          if (chess.inCheck()) {
            io.emit("check", chess.turn());
          }
          if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
              io.emit("checkmate", chess.turn());
            }
            if (chess.isDraw()) {
              io.emit("draw");
            }
            chess.reset();
            players = {}; // 🔥 Reset player slots
            io.emit("boardState", chess.fen()); // 🔥 Send updated board after reset
          }
        } else {
          uniquesocket.emit("invalidMove");
        }
      } catch (e) {
        uniquesocket.emit("invalidMove");
      }
    } else {
      uniquesocket.emit("connecting");
    }
  });
});

server.listen(3000);
