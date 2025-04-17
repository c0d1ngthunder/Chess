import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import renderBoard from "./renderBoard";
import GameEnd from "./components/GameEnd";
import Sidebar from "./components/Sidebar";
import Connected from "./components/Connected";
import Waiting from "./components/Waiting";
import { CiLock, CiUnlock } from "react-icons/ci";
import { chessContext } from "./context/Context";

const App = () => {
  const {
    playerRole,
    setPlayerRole,
    lostPlayer,
    setLostPlayer,
    cause,
    setCause,
    visible,
    changevisible,
    showBtn,
    setShowBtn,
    game,
    setGame,
    isFullscreen,
    setIsFullscreen,
    setHistory,
    isLocked,
    setMessages,
    connectToServer,
    chess,
    boardref,
    renderBoardUtil,
    toggleLock,
    handleMove,
    GetPieceUnicode,
    resign,
    exportBoard,
    sendMessage,
    reset,
    draggedPiece,
    sourceSquare
  } = useContext(chessContext); // Context to manage state

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

    socket.on("message", (data) => {
      let audio = new Audio("/media/notification.mp3");
      audio.play();
      setMessages((prev) => [...prev, data]);
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
    });

    return () => {
      socket.off("move");
      socket.off("boardState");
      socket.off("playerRole");
      socket.off("spectatorRole");
      socket.off("message");
      socket.off("connected");
      socket.off("invalidMove");
      socket.off("check");
      socket.off("checkmate");
      socket.off("Resign");
      socket.off("draw");
      socket.off("connecting");
    };
  }, [playerRole]);

  useEffect(() => {
    if (playerRole !== null) {
      renderBoardUtil();
    }
  }, [playerRole]);
  useEffect(() => {
    window.addEventListener("beforeunload", function (event) {
      event.preventDefault();
    });
  });

  return (
    <main
      className={`w-full lg:overflow-hidden ${
        isFullscreen && "overflow-hidden"
      } min-h-screen m-auto items-center text-white h-full bg-[#0D1117] flex flex-col`}
    >
      {!isFullscreen && (
        <div className="w-full p-4 bg-transparent text-2xl font-extrabold text-[#2DD4AF]">
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
              resign={resign}
              chess={chess}
              reset={reset}
              sendMessage={sendMessage}
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
                  false
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
          />
        ) : (
          `${lostPlayer === "w" ? "White" : "Black"} lost by ${cause.cause}`
        ))}
      {!showBtn && (game ? visible && <Connected /> : <Waiting />)}
    </main>
  );
};

export default App;
