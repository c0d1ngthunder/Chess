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

  uniquesocket.on("disconnect", () => {
    if (uniquesocket.id === players.white) {
      io.emit("Resign", "b");
      delete players.white;
    } else if (uniquesocket.id === players.black) {
      io.emit("Resign", "w");
      delete players.black;
    }
  });

  uniquesocket.on("move", (move) => {
    try {
      if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
      if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

      let response = chess.move(move);
      if (response) {
        currentplayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
        if (chess.isGameOver()) {
          if (chess.inCheck()) {
            io.emit("check", chess.turn());
          }
          if (chess.isCheckmate()) {
            io.emit("checkmate", chess.turn());
          }
          if (chess.isDraw()) {
            io.emit("draw");
        }}
      } else {
        uniquesocket.emit("invalidMove");
      }
    } catch (e) {
      console.log(e);
      uniquesocket.emit("invalidMove", move);
    }
  });
});

server.listen(3000);
