import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { chessContext } from "../context/Context";

const Home = () => {
  const { connectToServer } = useContext(chessContext);
  return (
    <div>
      <Link
        to="/Game"
        onClick={() => {
          connectToServer();
        }}
        className={`text-md play cursor-pointer p-4 px-8 bg-transparent transition duration-200 ease border-1 absolute -translate-x-[50%] z-10 -translate-y-[50%] top-[50%] left-[50%]`}
      >
        Play
      </Link>
    </div>
  );
};

export default Home;
