import React, { useContext, useEffect } from "react";
import { chessContext } from "../context/Context";
import { CiLock, CiUnlock } from "react-icons/ci";
import Sidebar from "./Sidebar";
import Waiting from "./Waiting";
import renderBoard from "../renderBoard";
import Connected from "./Connected";
import GameEnd from "./GameEnd";

const Game = () => {
  const {
    disconnect,
    cause,
    isFullscreen,
    boardref,
    playerRole,
    game,
    lostPlayer,
    toggleLock,
    isLocked,
    exportBoard,
    setIsFullscreen,
    chess,
    GetPieceUnicode,
    handleMove,
    draggedPiece,
    sourceSquare,
    reset,
    visible,
    resign,
    sendMessage,
    connectToServer,
    connected,
    setConnected
  } = useContext(chessContext);

  useEffect(() => {
    if (game) {
      if (!lostPlayer) {
        window.addEventListener("beforeunload", function (event) {
          event.preventDefault();
        });
      }
    }
  });

  useEffect(()=>{
    connectToServer()
    return ()=>{
      disconnect()
    }
  },[])

  return (
    <div className="w-full relative flex flex-col items-center lg:flex-row min-h-[90%] h-full">
      <div
        id="left"
        className={`w-full relative flex justify-center h-full ${
          isFullscreen && "h-screen"
        } items-center `}
      >
        <div
          ref={boardref}
          id="board"
          className={`board ${
            playerRole === "b" && "flipped"
          } shadow-[0_0_15px_rgba(20,184,166,0.2)] transition-all ease-in-out duration-500 ${
            isFullscreen && "scale-125"
          } relative sm:h-100 grid sm:w-100 h-80 w-80`}
        ></div>
        <button
          onClick={() => toggleLock()}
          className="top-0 text-xl absolute right-0 sm:right-20 lg:opacity-0"
        >
          {isLocked ? <CiUnlock /> : <CiLock />}
        </button>
      </div>
      {(connected || lostPlayer ) &&
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
      {game && !playerRole && <div>You are a spectator</div>}
      {lostPlayer &&
        (playerRole ? (
          <GameEnd />
        ) : (
          `${lostPlayer === "w" ? "White" : "Black"} lost by ${cause.cause}`
        ))}

      {!lostPlayer &&(connected ? visible && <Connected /> : <Waiting />)}
    </div>
  );
};

export default Game;
