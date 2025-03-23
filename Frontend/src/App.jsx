import { useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js
import renderBoard from "./renderBoard";
import GameEnd from "./components/GameEnd";
import Sidebar from "./components/Sidebar";
import Connected from "./components/Connected";
import Waiting from "./components/Waiting";

const App = () => {
  let draggedPiece = useRef(null);
  let sourceSquare = useRef(null);
  // Variable to store the source square
  const [playerRole, setPlayerRole] = useState(null); // Variable to store the player role
  let [lostPlayer, setLostPlayer] = useState(null);
  let [cause, setCause] = useState({ isdraw: false, cause: null });
  const [visible, setVisible] = useState(true);
  const chess = useRef(new Chess()).current; // State to store the chess game
  let [showBtn, setShowBtn] = useState(true);
  const [game, setGame] = useState();
  const [hover, setHover] = useState(false);
  const [history, setHistory] = useState([]);

  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setLostPlayer("");
    setCause({ isdraw: false, cause: null });
    setVisible(true);
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
      renderBoard(
        boardref,
        chess,
        playerRole,
        GetPieceUnicode,
        draggedPiece,
        sourceSquare,
        handleMove
      );
      const timer = setTimeout(() => {
        changevisible();
      }, 3000);
    });

    socket.on("connecting", () => {
      setGame(false);
    });

    socket.on("playerRole", (role) => {
      setPlayerRole(role);
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

    socket.on("boardState", (fen, history) => {
      chess.load(fen); // Load the board state
      setHistory(history);
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
      setCause({ isdraw: false, cause: "Checkmate" });
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
      setCause({ isdraw: false, cause: "Resignation" });
      setLostPlayer(color);
      chess.reset();
    });

    socket.on("draw", () => {
      setCause({ isdraw: true, cause: "" });
      setLostPlayer("Both");
      chess.move(move);
      chess.load(fen);
      let audio1 = new Audio("./media/game-end.mp3");
      audio1.play();
      let audio2 = new Audio("./media/game-draw.mp3");
      audio2.play();
      socket.disconnect();
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
    <main className="w-full min-h-screen m-auto items-center text-white h-full bg-[#0D1117] flex flex-col">
      <div className="w-full p-4 mb-10 text-2xl font-extrabold text-[#2DD4AF]">
        Chess
      </div>
      {showBtn && (
        <button
          onClick={() => {
            connectToServer();
            setShowBtn(false);
            setHover(false);
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className={`text-md cursor-pointer p-4 px-8 bg-transparent transition duration-200 ease border-1 ${
            hover
              ? "bg-white border-white text-black"
              : "bg-transparent text-white"
          } absolute -translate-x-[50%] z-10 -translate-y-[50%] top-[50%] left-[50%]`}
        >
          Play
        </button>
      )}
      <div className="w-full flex flex-col lg:flex-row h-full">
        <div id="left" className="w-full relative flex justify-center">
          <div
            ref={boardref}
            className={`board ${
              !showBtn && "shadow-[0_0_15px_rgba(20,184,166,0.2)]"
            } relative sm:h-100 grid sm:w-100 h-80 w-80`}
          ></div>
          <button
            onClick={() => document.body.classList.toggle("overflow-hidden")}
            className="top-0 absolute right-0 sm:right-20 lg:opacity-0"
          >
            Lock
          </button>
        </div>
        {game && <Sidebar history={history} />}
      </div>
      { game &&
        (!playerRole && (
          <div>
            You are a spectator
          </div>
        ))
      }
      { lostPlayer && (playerRole ? (
        <GameEnd
          lostPlayer={lostPlayer}
          cause={cause}
          reset={reset}
          playerRole={playerRole}
          setLostPlayer={setLostPlayer}
          setHover={setHover}
          hover={hover}
        />
      )
      : `${lostPlayer==="w" ? "White" : "Black" } lost by ${cause.cause}`
    )}
      {!showBtn &&
        (game ? (
          visible && (
            <Connected/>
          )
        ) : (
          <Waiting/>
        ))}
    </main>
  );
};

export default App;
