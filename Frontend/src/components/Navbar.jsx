import { useContext } from "react";
import { chessContext } from "../context/Context";

const Navbar = () => {
  const {isFullscreen} = useContext(chessContext);

  return (
    <>
      {!isFullscreen && (
        <nav className="w-full mb-8 border-[#20272C] border-b-2 p-3 bg-[#161B22] text-2xl font-extrabold text-[#2DD4AF]">
          Chess
        </nav>
      )}
    </>
  );
};

export default Navbar;
