import React from "react";
import { IoMdClose } from "react-icons/io";

const GameEnd = ({setLostPlayer,lostPlayer,playerRole,cause,setHover,hover,reset}) => {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-90 bg-[#111111] text-white h-60 px-4">
      <button
        onClick={() => setLostPlayer(null)}
        className="cursor-pointer absolute right-2 text-xl "
      >
        <IoMdClose className="text-2xl my-1" />
      </button>
      <h1 className="text-2xl py-10 flex justify-center">
        {!cause.isdraw && (lostPlayer === playerRole ? "Opponent" : "You")}{" "}
        {cause.isdraw ? "Game Draw" : "won"}{" "}
        {!cause.isdraw && " by " + cause.cause}
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
  );
};

export default GameEnd;
