import { useContext, useEffect, useRef, useState } from "react";
import { socket } from "./socket"; // Import socket.io-client
import GameEnd from "./components/GameEnd";
import Connected from "./components/Connected";
import Waiting from "./components/Waiting";
import { chessContext } from "./context/Context";
import Routing from "./utils/Routing";

const App = () => {
  const {
    playerRole,
    setPlayerRole,
    setLostPlayer,
    setCause,
    changevisible,
    setGame,
    isFullscreen,
    setHistory,
    setMessages,
    chess,
    renderBoardUtil,
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

      <Routing />
    </main>
  );
};

export default App;
