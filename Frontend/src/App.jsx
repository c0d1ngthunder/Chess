import { useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import { Chess } from "chess.js"; // Import chess.js
import renderBoard from "./renderBoard";
import Navbar from "./Navbar";
import { IoMdClose } from "react-icons/io";

const App = () => {
  let draggedPiece = useRef(null);
  let sourceSquare = useRef(null);
  // Variable to store the source square
  const [playerRole, setPlayerRole] = useState(null); // Variable to store the player role
  let [lostPlayer, setLostPlayer] = useState();
  let [cause, setCause] = useState({isdraw:false,cause:null});
  const [visible, setVisible] = useState(true);
  const chess = useRef(new Chess()).current; // State to store the chess game
  let [showBtn, setShowBtn] = useState(true);
  const [game, setGame] = useState();
  const [hover, setHover] = useState(false);
  const [history,setHistory] = useState()

  const boardref = useRef(null); // Reference to the board

  const reset = () => {
    setLostPlayer("");
    setCause({isdraw:false,cause:null});
    setVisible(true)
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

    socket.on("boardState", (fen,history) => {
      chess.load(fen); // Load the board state
      setHistory(history)
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
      setCause({isdraw:false,cause:"Checkmate"});
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
      setCause({isdraw:false,cause:"Resignation"});
      setLostPlayer(color);
      chess.reset();
    });

    socket.on("draw", () => {
      setCause({isdraw:true,cause:""})
      setLostPlayer("Both");
      chess.move(move)
      chess.load(fen)
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
    <div className="w-full overflow-hidden text-white h-screen bg-[#0a0a0a] flex flex-col items-center">
      <Navbar />
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
          } absolute -translate-x-[50%] -translate-y-[50%] top-[50%] left-[50%]`}
        >
          Play
        </button>
      )}
      <div ref={boardref} className="board sm:h-100 sm:w-100 h-80 w-80"></div>
      {history &&
      <div className="history mt-2 w-80 h-10 left-[25] whitespace-nowrap overflow-x-auto bg-[#111111] ">
        { history.join(" ")}
      </div>
      }
      {lostPlayer && (
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-90 bg-[#111111] text-white h-60 px-4">
          <button
            onClick={() => setLostPlayer(null)}
            className="cursor-pointer absolute right-2 text-xl "
          >
            <IoMdClose className="text-2xl my-1" />
          </button>
          <h1 className="text-2xl py-10 flex justify-center">
            {!cause.isdraw && (lostPlayer === playerRole ? "Opponent" : "You") }
            {" "}
            {cause.isdraw ? "Game Draw" : "won"} {!cause.isdraw && " by "+ cause.cause}
          </h1>
          <button
            className={`text-lg cursor-pointer bg-transparent ${
              hover
                ? "bg-white border-white text-black"
                : "bg-transparent text-white"
            } duration-200 transition-all border-1 p-3 left-[30%] mt-4 absolute`}
            onClick={() => reset()}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Play again
          </button>
        </div>
      )}
      {!showBtn &&
        (game ? (
          visible && (
            <div className="bg-[#111111] rounded font-bold text-blue-400 after:content-[''] h-10 after:bg-white after:w-[100%] after:animate-[decrease_3s_linear_forwards] overflow-hidden after:absolute after:bottom-0 after:left-0 after:h-[5px] py-2 relative w-45 px-4 bottom-[5x] -left-15 sm:-left-30">
              Connected
            </div>
          )
        ) : (
          <div className="bg-[#111111] h-[30%] sm:h-[50%] sm:top-[50%] sm:-translate-y-[50%] p-8 -translate-y-[50%] absolute left-[50%] -translate-x-[50%] top-[30%] ">
            Waiting for another player to join...
          </div>
        ))}
    </div>
  );
};

export default App;
