import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { chessContext } from "../context/Context";

const Home = () => {
  const { connectToServer } = useContext(chessContext);
  return (
    <div className="w-full flex h-full">
      <div className="left w-[50%] p-4 ">
        <div className="text-5xl font-medium ">
          <span className="text-[#40C7B8]">Next-Gen</span> Chess Experience
        </div>
        <div className="py-8 text-[gray]">
          Experience chess reimagined with a modern tech-forward interface. Play against opponents worldwide, export your favorite games and improve your skills.
        </div>
        <Link
          to="/Game"
          className={`text-md bg-[#0D9488] hover:bg-[#076d65] inline-block cursor-pointer p-4 px-8 transition duration-200 ease rounded-sm`}
        >
          Start Playing
        </Link>
        <ul className="my-6 text-[gray]">
          <li>Realtime matches</li>

          <li>Players across the globe </li>
        </ul>
      </div>
      <div className="right flex justify-center w-[50%]  ">
        <div className="bg-[#161B22] rounded-md w-[60%]">
          <div className="flex w-full p-8 gap-2 h-10 border-b-2 border-[#20272C]">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <img
            className="pointer-events-none p-8 select-none my-2"
            src="/images/image.png"
            alt=""
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Home;
