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

const Sidebar = ({
  setIsFullscreen,
  history,
  chess,
  playerRole,
  resign,
  exportBoard,
  lostPlayer,
  reset,
  exporting,
  setExporting,
  activeTab,
  setActiveTab,
  messages,
  inputValue,
  setInputValue,
  sendMessage
}) => {
  return (
    <div
      id="right"
      className="flex gap-4 flex-col lg:w-full items-center right sm:w-[70%] w-full p-5"
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
            onClick={() => {
              reset();
            }}
            className={`py-2 focused cursor-pointer disabled:cursor-not-allowed bg-[#0D9488] sm:w-30 w-full rounded-sm`}
            disabled={!lostPlayer ? true : false}
          >
            <VscDebugRestart className="inline mr-4 text-lg" />
            <span>New</span>
          </button>
          <button
            onClick={() => {
              resign();
            }}
            className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm"
          >
            <IoFlagOutline className="inline mr-4 text-lg" />{" "}
            <span>Resign</span>
          </button>
          <button className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm">
            <IoSettingsOutline className="inline text-lg mr-4" />
            Settings
          </button>
          <button
            onClick={() => setExporting(true)}
            className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm"
          >
            <FiDownload className="text-lg inline mr-4" />
            <span>Export</span>
          </button>
          <button className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm">
            <IoShareSocialOutline className="text-lg inline mr-4" />
            <span>Share</span>
          </button>
          <button
            onClick={() => {
              setIsFullscreen(true);
            }}
            className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm"
          >
            <MdFullscreen className="text-lg mr-4 inline" />
            <span>Fullscreen</span>
          </button>
        </section>
      )}
      <section className="bg-[#161B22] w-[70%] rounded">
        <div className="top p-4">
          <CiChat1 className="text-3xl" />
        </div>
        <div className="overflow-y-scroll bg-[#13171d] w-full h-60 flex flex-col chat">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 bg-[#161B22] w-fit inline-block m-2 rounded-lg text-sm ${
                message.role === playerRole
                  ? "text-blue-500 self-end"
                  : "text-green-500"
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        <div className="px-8 p-4 bg-[#13171d] flex justify-between">
          <input
          value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="outline-none border-1 rounded p-2 w-[75%] border-[#8d8d8d]"
            type="text"
            placeholder="Type a message"
          />
          <button
            onClick={() => sendMessage()}
            className="px-4 p-2 bg-[#0d9488] rounded-md"
          >
            Send
          </button>
        </div>
      </section>

      {exporting && (
        <aside id="exp" className="w-60 bg-[#161B22] rounded-sm p-4">
          <h4>Export Game as:</h4>
          <button
            className="p-3 hover:bg-[#090C11] bg-[#0D1117] w-20 m-2 rounded-sm "
            onClick={() => exportBoard("img")}
          >
            Image
          </button>
          <button
            className="hover:bg-[#090C11] p-3 bg-[#0D1117] m-2 w-20 rounded-sm "
            onClick={() => exportBoard("pgn")}
          >
            PGN
          </button>
        </aside>
      )}
    </div>
  );
};

export default Sidebar;
