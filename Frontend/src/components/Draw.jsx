import { useContext } from "react";
import { chessContext } from "../context/Context";
import { IoWarningOutline } from "react-icons/io5";

const Draw = () => {
  const { showDraw,drawaccept,setShowDraw, playerRole } = useContext(chessContext);
  return (
    <>
      {showDraw &&
        (showDraw === playerRole ? (
          <aside className="bg-[#0D1117] p-4 bottom-10 fixed rounded">
            Draw requested
          </aside>
        ) : (
          <aside className="bg-[#0D1117] max-w-[30%] p-10 bottom-10 fixed rounded-lg">
            <div className="flex items-center gap-2">
            <div className="bg-[#161B22] p-4 rounded-full w-fit border-[#30363D] border-1 inline-block items-center">
              <IoWarningOutline className="text-xl inline text-yellow-500" />
            </div>
            <div className="py-4 mx-2 inline">
              <div className="font-bold inline">Draw Offer Received!</div>
              <p className="text-xs text-[gray]">Your opponent has proposed a draw. Accept or decline?</p>
            </div>
            </div>
            <div className="py-4 flex gap-8">
              <button onClick={()=>{drawaccept()}} className="bg-[#161B22] hover:bg-[#1e252e] border-1 border-[#30363d] transition-all duration-200 ease hover:border-[#2DD4AF] p-3 rounded-md">Accept Draw</button>
              <button onClick={()=>{setShowDraw(false)}} className="bg-[#161B22] hover:bg-[#1e252e] border-1 border-[#30363d] transition-all duration-200 ease hover:border-red-300 p-3 rounded-md">Decline</button>
            </div>
          </aside>
        ))}
    </>
  );
};

export default Draw;
