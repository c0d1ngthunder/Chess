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

  if (players.white && players.black){
    if (uniquesocket.id === players.white || uniquesocket.id === players.black) {
    io.emit("connected");
  }else{
    uniquesocket.emit("connected")
  }
} else {
    uniquesocket.emit("connecting");
  }

  uniquesocket.emit("boardState", chess.fen(), chess.history()); // Send latest board when someone connects

  uniquesocket.on("disconnect", () => {
    if (uniquesocket.id === players.white) {
      delete players.white;
      delete players.black;
      chess.reset();
      io.emit("Resign", "w");
      io.emit("connecting");
      io.emit("boardState", chess.fen(), chess.history());
    } else if (uniquesocket.id === players.black) {
      delete players.black;
      delete players.white;
      chess.reset();
      io.emit("Resign", "b");
      io.emit("connecting");
      io.emit("boardState", chess.fen(), chess.history());
    }
  });

uniquesocket.on("draw",()=>{
  delete players.white;
  delete players.black;
  chess.reset();
  io.emit("draw","Agreement");
  io.emit("connecting");
})

  uniquesocket.on("resign", (player) => {
    if (player === "w") {
      delete players.white;
      delete players.black;
      chess.reset();
      io.emit("Resign", "w");
      io.emit("connecting");
      io.emit("boardState", chess.fen(), chess.history());
    } else {
      delete players.white;
      delete players.black;
      chess.reset();
      io.emit("Resign", "b");
      io.emit("connecting");
      io.emit("boardState", chess.fen(), chess.history());
    }
  });

  uniquesocket.on("message",(data)=>{
    io.emit("message",data)
  })

uniquesocket.on("reqdraw",(player)=>{
  uniquesocket.broadcast.emit("reqdraw",player)
})

  uniquesocket.on("move", (move) => {
    if (players.white && players.black) {
      try {
        if (chess.turn() === "w" && uniquesocket.id !== players.white)
          socket.emit("invalidMove");
        if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

        let response = chess.move(move);
        if (response) {
          currentplayer = chess.turn();

          if (chess.isGameOver()) {
            if (chess.isCheckmate()) {
              io.emit("move", move);
              io.emit("boardState", chess.fen(), chess.history());
              io.emit("checkmate", chess.turn());
            }
            if (chess.isDraw()) {
              io.emit("move", move);
              io.emit("boardState", chess.fen(), chess.history());
              io.emit("draw");
            }
            chess.reset();
            players = {}; // 🔥 Reset player slots
            io.emit("boardState", chess.fen(), chess.history()); // 🔥 Send updated board after reset
          } else if (chess.inCheck()) {
            io.emit("check", move);
            io.emit("boardState", chess.fen(), chess.history());
          } else {
            io.emit("move", move);
            io.emit("boardState", chess.fen(), chess.history());
          }
        } else {
          uniquesocket.emit("invalidMove");
        }
      } catch (e) {
        uniquesocket.emit("invalidMove");
      }
    } else {
      uniquesocket.emit("connecting");
      uniquesocket.emit("invalidMove");
    }
  });
});

server.listen(3000);
