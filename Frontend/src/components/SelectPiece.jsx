import { useContext } from "react";
import { chessContext } from "../context/Context";
import { socket } from "../socket";

const SelectPiece = () => {
  const { pendingMove, setPendingMove } = useContext(chessContext);
  return (
    <div className="w-[30%] z-99 h-24 absolute top-0 left-1/4">
      <p className="text-[#2DD4AF] w-full mb-2">Promote pawn to:</p>
      <div className="gap-6 w-full flex">
        {["q", "r", "b", "n"].map((piece) => (
          <div
            onClick={() => {
              socket.emit("move", { ...pendingMove, promotion: piece });
              setPendingMove(null);
            }}
            key={piece}
            className="w-1/4 border-1 p-1 rounded-lg h-full flex justify-center items-center text-4xl cursor-pointer"
          >
            {piece === "q" && "♕"}
            {piece === "r" && "♖"}
            {piece === "b" && "♗"}
            {piece === "n" && "♘"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPiece;
