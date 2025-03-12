import { useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js
import renderBoard from "./renderBoard";
import Navbar from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router";

const App = () => {
  let draggedPiece = useRef(null);
  let sourceSquare = useRef(null);
  // Variable to store the source square
  const [playerRole, setPlayerRole] = useState(null); // Variable to store the player role
  let [lostPlayer, setLostPlayer] = useState("");
  let [causeofloss, setCauseofloss] = useState("");
  const [visible, setVisible] = useState(true);
  const chess = useRef(new Chess()).current; // State to store the chess game
  let [showBtn, setShowBtn] = useState(true);
  const [game, setGame] = useState();
  const [hover, setHover] = useState(false);

  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setLostPlayer("");
    setCauseofloss("");
    socket.connect();
  };
  const GetPieceUnicode = (piece) => {
    const unicodes = {
      p: {
        w: "♙", // White Pawn (U+2659)
        b: "♙", // Black Pawn (U+265F) ♟
      },
      n: {
        w: "♘", // White Knight (U+2658)
        b: "♞", // Black Knight (U+265E)
      },
      b: {
        w: "♗", // White Bishop (U+2657)
        b: "♝", // Black Bishop (U+265D)
      },
      r: {
        w: "♖", // White Rook (U+2656)
        b: "♜", // Black Rook (U+265C)
      },
      q: {
        w: "♕", // White Queen (U+2655)
        b: "♛", // Black Queen (U+265B)
      },
      k: {
        w: "♔", // White King (U+2654)
        b: "♚", // Black King (U+265A)
      },
    };

    if (!piece) return "";
    return unicodes[piece.type][piece.color];
  };
  const handleMove = (source, target) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    };

    try {
      let result = chess.move(move); // Attempt to move the piece
      if (result) {
        let audio1 = new Audio("./media/move-self.mp3");
        audio1.play();
        socket.emit("move", move);
      } else {
        let audio1 = new Audio("./media/illegal.mp3");
        audio1.play();
      }
    } catch {
      let audio1 = new Audio("./media/illegal.mp3");
      audio1.play();
    }
  };
  const connectToServer = () => {
    socket.connect();
  };
  const changevisible = () => {
    setVisible(false);
  };
  useEffect(() => {
    socket.on("connected", () => {
      setGame(true);
      let audio1 = new Audio("./media/game-start.mp3");
      audio1.play();
      const timer = setTimeout(() => {
        changevisible();
      }, 3000);
    });

    socket.on("connecting", () => {
      setGame(false);
    });

    socket.on("playerRole", (role) => {
      setPlayerRole(role);
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
    });

    socket.on("spectatorRole", () => {
      setPlayerRole(role);
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
    });

    socket.on("boardState", (fen) => {
      chess.load(fen); // Load the board state
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
    });

    socket.on("move", (move) => {
      let move1 = chess.move(move);
      if (move1.isCapture()) {
        let audio1 = new Audio("./media/capture.mp3");
        audio1.play();
      } else {
        let audio1 = new Audio("./media/move-opponent.mp3");
        audio1.play();
      }
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
    });

    socket.on("check", () => {
      let audio1 = new Audio("./media/move-check.mp3");
      audio1.play();
    });

    socket.on("checkmate", (turn) => {
      socket.disconnect();
      let audio1 = new Audio("./media/game-end.mp3");
      audio1.play();
      if (turn === playerRole) {
        let audio2 = new Audio("./media/game-lose-long.mp3");
        audio2.play();
      } else {
        let audio2 = new Audio("./media/game-win-long.mp3");
        audio2.play();
      }
      setCauseofloss("Checkmate");
      setLostPlayer(turn);
      chess.reset();
    });

    socket.on("Resign", (color) => {
      socket.disconnect();
      let audio1 = new Audio("./media/game-end.mp3");
      audio1.play();
      if (color === playerRole) {
        let audio2 = new Audio("./media/game-lose-long.mp3");
        audio2.play();
      } else {
        let audio2 = new Audio("./media/game-win-long.mp3");
        audio2.play();
      }
      setCauseofloss("Resignation");
      setLostPlayer(color);
      chess.reset();
      if (playerRole !== null) {
        renderBoard(
          boardref,
          chess,
          playerRole,
          GetPieceUnicode,
          draggedPiece,
          sourceSquare,
          handleMove
        );
      }
    });

    socket.on("draw", () => {
      socket.disconnect();
      let audio1 = new Audio("./media/game-end.mp3");
      audio1.play();
      let audio2 = new Audio("./media/game-draw.mp3");
      audio2.play();
      setCauseofloss("Draw");
      setLostPlayer("Both");
      chess.reset();
    });

    return () => {
      socket.off("move");
      socket.off("boardState");
      socket.off("playerRole");
      socket.off("spectatorRole");
    };
  }, [playerRole]);

  useEffect(() => {
    if (playerRole !== null) {
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
    }
  }, [playerRole]);

  return (
    <div className="w-full overflow-hidden h-screen bg-[#0a0a0a] flex flex-col justify-center items-center">
      <Navbar />
      {showBtn && (
        <button
          onClick={() => {
            setShowBtn(false);
            connectToServer();
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`text-md p-4 px-8 bg-transparent transition duration-200 ease border-1 ${
            hover ? "bg-white border-white text-black" : "bg-transparent text-white"
          } absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%]`}
        >
          Play
        </button>
      )}
      <div ref={boardref} className="board h-112 w-112"></div>
      {lostPlayer && (
        <div className="absolute bg-white h-60 p-4 rounded-lg">
          <h1 className="text-2xl text-black">
            {lostPlayer === playerRole ? "Opponent" : "You"}{" "}
            {causeofloss === "Draw" ? "drew the game" : "won"} by {causeofloss}
          </h1>
          <button
            className="text-lg bg-green-400 p-2 rounded-md left-[30%] mt-4 absolute"
            onClick={() => reset()}
          >
            Play again
          </button>
        </div>
      )}
      {!showBtn &&
        (game ? (
          visible && (
            <div className="bg-white after:content-[''] h-10 after:bg-green-400  after:w-[100%] after:animate-[decrease_3s_linear_forwards] after:absolute after:bottom-0 after:left-0 after:h-[5px] py-2 relative w-45 px-4 bottom-5 right-50">
              Connected
            </div>
          )
        ) : (
          <div className="bg-white w-[20%] h-[60%] p-8 -translate-y-[30%] absolute top-[50%]">
            Connecting to another player
          </div>
        ))}
    </div>
  );
};

export default App;
