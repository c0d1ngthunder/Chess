import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <nav className='text-white rounded container flex gap-8 bg-[#111111] w-full p-4 mt-0 mb-10'>
        <Link className='text-[#2DD4AF] text-xl font-bold' to={"/"}>Chess</Link>
        <Link to={"/play"}>Play</Link>
        <Link to={"/rules"}>Rules</Link>
    </nav>

    {/* <Routes>
<Route path="/" element={<Home />} />
<Route path="/play" element={<Play />} />
<Route path="/rules" element={<Rules />} />
    </Routes> */}
    </>
  )
}

export default Navbar