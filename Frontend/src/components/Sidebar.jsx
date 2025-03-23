import React from 'react'

const Sidebar = ({history}) => {
  return (
                  <div id="right" className="flex gap-4 flex-col items-center right w-full p-5">
                    <section className="bg-[#161B22] w-[70%] p-4 rounded">
                      <div className="grid gap-4 grid-cols-2">
                        <div className="text-xs text-[#9CA3AF] p-4 rounded-sm bg-teal-400/10 border-teal-400/30 border">
                          WHITE
                        </div>
                        <div className="text-xs text-[#9CA3AF] p-4 rounded-sm bg-teal-400/10 border-teal-400/30 border">
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
                    <section className="bg-[#161B22] text-sm w-[70%] flex flex-wrap gap-4 p-4 rounded">
                      <button className={`py-2 focused cursor-pointer bg-[#0D9488] lg:w-30 w-30 md:w-25 rounded-sm`}>New</button>
                      <button className="py-2 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">Resign</button>
                      <button className="py-2 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">Settings</button>
                      <button className="py-2 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">Export</button>
                      <button className="py-2 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">Share</button>
                      <button className="py-2 nonfocused cursor-pointer bg-[#0D1117] md:w-25 w-30 lg:w-30 rounded-sm">Fullscreen</button>
                    </section>
                    <section className="bg-[#161B22] w-[80%] rounded"></section>
                  </div>
  )
}

export default Sidebar