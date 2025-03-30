import React from "react";
import {
  IoShareSocialOutline,
  IoFlagOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { VscDebugRestart } from "react-icons/vsc";
import { CiChat1 } from "react-icons/ci";

const Sidebar = ({ history, chess, playerRole, resign, exportBoard,lostPlayer, reset }) => {
  return (
    <div
      id="right"
      className="flex gap-4 flex-col items-center right w-full p-5"
    >
      <section className="bg-[#161B22] w-[70%] p-4 rounded">
        <div className="grid gap-4 grid-cols-2">
          <div
            className={`text-xs transition-all duration-500 text-[#9CA3AF] p-4 rounded-sm ${
              chess.turn() == "w"
                ? "bg-teal-400/10 border-teal-400/30"
                : "bg-[#0D1117] border-[#30363D] "
            } border`}
          >
            WHITE
          </div>
          <div
            className={`text-xs transition-all duration-500 text-[#9CA3AF] p-4 rounded-sm ${
              chess.turn() == "b"
                ? "bg-teal-400/10 border-teal-400/30"
                : "bg-[#0D1117] border-[#30363D] "
            } border`}
          >
            BLACK
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="py-1 px-4 text-[#9CA3AF] rounded-sm border-[#30363D] border">
            <span className="text-xs">MOVES:</span>
            <span>{history && Math.floor(history.length / 2)}</span>
          </div>
          <div></div>
        </div>
      </section>
      {playerRole && (
        <section className="bg-[#161B22] text-sm w-[70%] flex flex-wrap gap-4 p-4 rounded">
          <button
            onClick={() => {reset()}}
            className={`py-2 focused cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-[#0D9488] lg:w-30 w-30 md:w-25 rounded-sm`}
            disabled={!lostPlayer ? true : false}
          >
            <VscDebugRestart className="inline mr-4 text-lg" />
            <span>New</span>
          </button>
          <button
            onClick={() => {
              resign();
            }}
            className="py-3 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm"
          >
            <IoFlagOutline className="inline mr-4 text-lg" />{" "}
            <span>Resign</span>
          </button>
          <button className="py-3 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">
            <IoSettingsOutline className="text-lg inline mr-4" />
            Settings
          </button>
          <button onClick={exportBoard} className="py-3 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">
            <FiDownload className="text-lg inline mr-4" />
            <span>Export</span>
          </button>
          <button className="py-3 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">
            <IoShareSocialOutline className="text-lg inline mr-4" />
            <span>Share</span>
          </button>
          <button className="py-3 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">
            <MdFullscreen className="text-lg mr-4 inline" />
            <span>Fullscreen</span>
          </button>
        </section>
      )}
      <section className="bg-[#161B22] w-[80%] rounded"></section>
    </div>
  );
};

export default Sidebar;
