import React, { useContext } from "react";
import { IoMdClose, IoMdRefresh, IoMdTrophy, IoMdFlag, IoMdTime } from "react-icons/io";
import { chessContext } from "../context/Context";

const GameEnd = () => {

  const { setLostPlayer, lostPlayer, playerRole, cause, reset } = useContext(chessContext);

  // Determine the result type icon
  const ResultIcon = () => {
    if (cause.isdraw) {
      return <IoMdTime className="text-yellow-400 text-3xl" />;
    } else if (lostPlayer === playerRole) {
      return <IoMdFlag className="text-red-500 text-3xl" />;
    } else {
      return <IoMdTrophy className="text-teal-400 text-3xl" />;
    }
  };

  // Determine the result message
  const getResultMessage = () => {
    if (cause.isdraw) {
      return "GAME_RESULT: DRAW";
    } else if (lostPlayer === playerRole) {
      return "GAME_RESULT: DEFEAT";
    } else {
      return "GAME_RESULT: VICTORY";
    }
  };

  // Get the cause description
  const getCauseDescription = () => {
    if (cause.isdraw) {
      return "The game ended in a draw";
    } else {
      return `${lostPlayer === playerRole ? "Opponent" : "You"} won by ${cause.cause}`;
    }
  };

  return (
    <div className="fixed inset-0 gameend bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center font-mono">
      <div className="bg-[#0d1117] border border-[#30363d] shadow-[0_0_20px_rgba(20,184,166,0.2)] w-full max-w-md p-6 relative">
        {/* Header with close button */}
        <div className="flex justify-between items-center border-b border-[#30363d] pb-3">
          <div className="text-sm text-gray-400">GAME_SESSION: TERMINATED</div>
          <button
            onClick={() =>{ let gameend = document.querySelector(".gameend")
              gameend.classList.add("pointer-events-none")
              gameend.classList.add("opacity-0")
            }}
            className="text-gray-400 hover:text-teal-400 transition-colors"
            aria-label="Close"
          >
            <IoMdClose className="text-xl" />
          </button>
        </div>

        {/* Main content */}
        <div className="py-6 grid gap-6">
          {/* Result icon and status */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <ResultIcon />
            </div>
            <div className="grid gap-1">
              <div className="text-lg font-bold text-white">
                {getResultMessage()}
              </div>
              <div className="text-sm text-gray-400">
                {getCauseDescription()}
              </div>
            </div>
          </div>

          {/* Technical details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#161b22] p-3 rounded-sm border border-[#30363d]">
            <div className="flex flex-col">
              <span className="text-gray-400">PLAYER:</span>
              <span className="text-white">{playerRole === "w" ? "WHITE" : "BLACK"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">OUTCOME:</span>
              <span className={`${cause.isdraw ? "text-yellow-400" : (lostPlayer === playerRole ? "text-red-500" : "text-teal-400")}`}>
                {cause.isdraw ? "DRAW" : (lostPlayer === playerRole ? "DEFEAT" : "VICTORY")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">METHOD:</span>
              <span className="text-white">{cause.isdraw ? "STALEMATE" : cause.cause.toUpperCase()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400">STATUS:</span>
              <span className="text-teal-400">READY_FOR_REMATCH</span>
            </div>
          </div>

          {/* Terminal-style message */}
          <div className="bg-[#161b22] p-3 rounded-sm border border-[#30363d] text-xs">
            <div className="flex items-center text-gray-400">
              <span className="text-teal-400 mr-2">&gt;</span>
              <span>system: </span>
              <span className="text-white ml-1">Game analysis complete. Ready for next match.</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <button
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 flex items-center justify-center gap-2 transition-colors duration-200 border border-teal-700"
            onClick={() => reset()}
          >
            <IoMdRefresh className="text-lg" />
            <span className="text-sm">NEW GAME</span>
          </button>
          <button
            className="bg-[#161b22] hover:bg-[#1d2633] text-white py-2 px-4 flex items-center justify-center gap-2 transition-colors duration-200 border border-[#30363d] hover:border-teal-400"
            onClick={() => setLostPlayer(null)}
          >
            <span className="text-sm">RETURN</span>
          </button>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#30363d]">
          <div className="h-full bg-teal-400 w-1/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default GameEnd;