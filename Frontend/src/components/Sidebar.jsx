import { useContext } from "react";
import { chessContext } from "../context/Context";
import {
  IoShareSocialOutline,
  IoFlagOutline,
} from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import { VscDebugRestart } from "react-icons/vsc";
import { CiChat1 } from "react-icons/ci";
import { RiTerminalLine } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import Draw from "./Draw";

const Sidebar = () => {
  const {
    requestDraw,
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
    messages,
    setInputValue,
    inputValue,
    sendMessage,
    activeTab,
    setActiveTab,
  } = useContext(chessContext);

  return (
    <div
      id="right"
      className="flex scroll self-start overflow-y-auto max-h-[85vh] gap-4 flex-col items-center right sm:w-[100%] w-full p-5"
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
          <button onClick={()=>{requestDraw()}} className="py-3 nonfocused cursor-pointer bg-[#0D1117] sm:w-30 w-full rounded-sm">
            <FaHandshake className="inline text-lg mr-4" />
            Draw
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

      <section className="w-[70%] rounded">
        <div className="p-4 select-none cursor-pointer flex gap-10 bg-[#13181d]">
          <div
            onClick={() => {
              setActiveTab("chat");
            }}
            className={`  px-2 p-1 ${
              activeTab === "chat" && "bg-[#181d24] rounded "
            }`}
          >
            <CiChat1 className="inline text-3xl" />
            <span className="px-2">Chat</span>
          </div>
          <div
            onClick={() => {
              setActiveTab("moves");
            }}
            className={`  px-2 p-1 ${
              activeTab === "moves" && "bg-[#161B22] rounded"
            }`}
          >
            <RiTerminalLine className="inline text-3xl" />
            <span className="px-2">Moves</span>
          </div>
        </div>
        {activeTab === "chat" ? (
          <div>
            <div className="overflow-y-scroll scroll bg-[#161B22] w-full h-60 flex flex-col">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <div
                    className={`p-3 bg-[#161B22] w-fit inline-block m-2 rounded-lg text-sm ${
                      message.role === playerRole
                        ? "text-blue-500 self-end"
                        : "text-green-500"
                    }`}
                    key={index}
                  >
                    {message.content}
                  </div>
                ))
              ) : (
                <div className="text-center my-auto">No messages yet</div>
              )}
            </div>
            <div className="px-8 p-4 bg-[#13171D] flex justify-between">
              <input
                type="text"
                placeholder="Type a message"
                className="outline-none border-1 rounded p-2 w-[75%] border-[#8d8d8d]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={() => sendMessage()}
                className="px-4 p-2 bg-[#0D9488] rounded-md "
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="overflow-y-scroll bg-[#161B22] p-4 scroll w-full h-60 flex flex-col">
              <div className="text-[#2DD4AF] font-bold ">Move History</div>
              <div className="grid grid-cols-[1fr_1fr_1fr] border-b-1 border-[gray] justify-between text-md text-[#acb3bf] p-2 w-[80%] ">
                <span>#</span>
                <span>White</span>
                <span>Black</span>
              </div>
              {history.length > 0 ? (
                [...Array(Math.ceil(history.length / 2))].map((_, i) => {
                  const whiteMove = history[i * 2];
                  const blackMove = history[i * 2 + 1];
                  return (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr] justify-between w-[80%] gap-4 p-2">
                      <span>{i + 1}.</span>
                      <span>{whiteMove}</span>
                      <span>{blackMove}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center my-auto">No moves yet</div>
              )}
            </div>
          </div>
        )}
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
      <Draw />
    </div>
  );
};

export default Sidebar;
