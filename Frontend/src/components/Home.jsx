import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

const Home = () => {
  return (
    <div className="w-full md:flex-row flex flex-col h-full">
      <div className="left md:w-[50%] w-[100%] p-4 ">
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
          <FaPlay className="inline-block mr-2" />
          Start Playing
        </Link>
        <ul className="my-6 text-[gray]">
          <li>Realtime matches</li>

          <li>Players across the globe </li>
        </ul>
      </div>
      <div className="right md:w-[50%] w-[100%] flex justify-center  ">
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
