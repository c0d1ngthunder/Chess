import { useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js
import renderBoard from "./renderBoard";
import GameEnd from "./components/GameEnd";
import Sidebar from "./components/Sidebar";
import Connected from "./components/Connected";
import Waiting from "./components/Waiting";
import { CiLock, CiUnlock } from "react-icons/ci";
import domtoimage from "dom-to-image";

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
  const [game, setGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setLostPlayer("");
    setCause({ isdraw: false, cause: null });
    setVisible(true);
    socket.connect();
  };

  const renderBoardUtil = () => {
    renderBoard(
      boardref,
      chess,
      playerRole,
      GetPieceUnicode,
      draggedPiece,
      sourceSquare,
      handleMove,
      isFullscreen
    );
  };

  const toggleLock = () => {
    document.body.classList.toggle("overflow-hidden");
    setIsLocked(document.body.classList.contains("overflow-hidden")); // Update state
  };

  const resign = () => {
    socket.emit("resign", playerRole);
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

  function exportBoard() {
    const board = document.getElementById("board");

    domtoimage
      .toPng(board)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "chessboard.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error capturing board:", error));
  }

  const handleMove = (source, target) => {
    const move = {
      from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
      to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    };

    chess.header(
      "Event",
      "Casual Game",
      "Site",
      "chessmasters",
      "Date",
      Date.now(),
      "White",
      "Player1",
      "Black",
      "Player2",
      "Result",
      "1-0"
    );
    console.log(chess.pgn());

    socket.emit("move", move);
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
      renderBoardUtil();
      setTimeout(changevisible, 3000);
    });

    socket.on("invalidMove", () => {
      let audio1 = new Audio("./media/illegal.mp3");
      audio1.play();
    });

    socket.on("connecting", () => {
      setGame(false);
    });

    socket.on("playerRole", (role) => {
      setPlayerRole(role);
    });

    socket.on("spectatorRole", (role) => {
      setPlayerRole(role);
    });

    socket.on("boardState", (fen, history) => {
      chess.load(fen); // Load the board state
      setHistory(history);
      renderBoardUtil();
    });

    socket.on("move", (move) => {
      try {
        let move1 = chess.move(move);
        if (move1.isCapture()) {
          let audio1 = new Audio("./media/capture.mp3");
          audio1.play();
        } else {
          let audio1 = new Audio("./media/move-opponent.mp3");
          audio1.play();
        }
      } catch {}
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
      renderBoardUtil();
    }
  }, [playerRole]);

  return (
    <main
      className={`w-full lg:overflow-hidden ${
        isFullscreen && "overflow-hidden" 
      } min-h-screen m-auto items-center text-white h-full bg-[#0D1117] flex flex-col`}
    >
      {!isFullscreen && (
        <div className="w-full p-4 mb-10 text-2xl font-extrabold text-[#2DD4AF]">
          Chess
        </div>
      )}
      {showBtn && (
        <button
          onClick={() => {
            connectToServer();
            setShowBtn(false);
          }}
          className={`text-md play cursor-pointer p-4 px-8 bg-transparent transition duration-200 ease border-1 absolute -translate-x-[50%] z-10 -translate-y-[50%] top-[50%] left-[50%]`}
        >
          Play
        </button>
      )}
      <div className="w-full relative flex flex-col items-center lg:flex-row h-full">
        <div
          id="left"
          className={`w-full relative flex justify-center h-full ${
            isFullscreen && "h-screen"
          } items-center `}
        >
          {!showBtn && (
            <div
              ref={boardref}
              id="board"
              className={`board ${
                playerRole === "b" && "flipped"
              } shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all ease-in-out duration-500 ${
                isFullscreen && "scale-125"
              } relative sm:h-100 grid sm:w-100 h-80 w-80`}
            ></div>
          )}
          <button
            onClick={() => toggleLock()}
            className="top-0 text-xl absolute right-0 sm:right-20 lg:opacity-0"
          >
            {isLocked ? <CiUnlock /> : <CiLock />}
          </button>
        </div>
        {game &&
          (!isFullscreen ? (
            <Sidebar
              exportBoard={exportBoard}
              history={history}
              resign={resign}
              playerRole={playerRole}
              chess={chess}
              lostPlayer={lostPlayer}
              reset={reset}
              setIsFullscreen={setIsFullscreen}
            />
          ) : (
            <button
              onClick={() => {
                setIsFullscreen(false);
                renderBoard(
                  boardref,
                  chess,
                  playerRole,
                  GetPieceUnicode,
                  draggedPiece,
                  sourceSquare,
                  handleMove,
                  (isFullscreen = false)
                );
              }}
              className="py-3 nonfocused cursor-pointer bg-[#161B22] w-50 h-16 my-14 mr-4 rounded-sm"
            >
              Exit Fullscreen
            </button>
          ))}
      </div>
      {game && !playerRole && <div>You are a spectator</div>}
      {lostPlayer &&
        (playerRole ? (
          <GameEnd
            lostPlayer={lostPlayer}
            cause={cause}
            reset={reset}
            playerRole={playerRole}
            setLostPlayer={setLostPlayer}
            setHover={setHover}
            hover={hover}
          />
        ) : (
          `${lostPlayer === "w" ? "White" : "Black"} lost by ${cause.cause}`
        ))}
      {!showBtn && (game ? visible && <Connected /> : <Waiting />)}
    </main>
  );
};

export default App;
